'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const router = useRouter();

  useEffect(() => {
  async function fetchUserAndNotes() {
    const res = await fetch('/api/me');
    const data = await res.json();

    if (!data.isLoggedIn) {
      router.push('/login');
    } else {
      setUser({ username: data.username });
      await fetchNotes();
    }
  }

  async function fetchNotes() {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data.notes || []);
  }

  fetchUserAndNotes();
}, [router]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(prev => [data.note, ...prev]);
        setNewNote({ title: '', content: '' });
        setIsAddingNote(false);
      } else {
        alert(data.message || 'Error adding note');
      }
    }
  };

  const handleEditNote = (note) => setEditingNote({ ...note });

  const handleSaveEdit = async () => {
    const res = await fetch(`/api/notes/${editingNote._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingNote),
    });
    const data = await res.json();

    if (res.ok) {
      setNotes(prev => prev.map(n => (n._id === data.note._id ? data.note : n)));
      setEditingNote(null);
    } else {
      alert(data.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotes(prev => prev.filter(note => note._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete');
      }
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link href="/" className="navbar-brand">Simple Audit Log Viewer</Link>
            <div className="navbar-nav">
              <span className="text-muted">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="button button-secondary button-small">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <main style={{ padding: '2rem 0' }}>
          <div className="mb-4">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Manage your personal notes</p>
          </div>

          {/* Notes Section */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="card-title">Your Notes</h2>
              <button
                onClick={() => setIsAddingNote(true)}
                className="button button-primary" style={{margin:'10px'}}
                disabled={isAddingNote}
              >
                Add New Note
              </button>
            </div>

            {isAddingNote && (
              <div className="card mb-3" style={{ backgroundColor: 'var(--secondary)' }}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-input form-textarea"
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter note content"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddNote} className="button button-primary button-small">Save Note</button>
                  <button onClick={() => { setIsAddingNote(false); setNewNote({ title: '', content: '' }); }} className="button button-secondary button-small">Cancel</button>
                </div>
              </div>
            )}

            <div className="note-list">
              {notes.length === 0 ? (
                <div className="text-center text-muted" style={{ padding: '2rem' }}>
                  <p>No notes yet. Create your first note to get started!</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note._id} className="note-item">
                    {editingNote && editingNote._id === note._id ? (
                      <>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-input"
                            value={editingNote.title}
                            onChange={(e) => setEditingNote(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="form-group">
                          <textarea
                            className="form-input form-textarea"
                            value={editingNote.content}
                            onChange={(e) => setEditingNote(prev => ({ ...prev, content: e.target.value }))}
                          />
                        </div>
                        <div className="note-actions">
                          <button onClick={handleSaveEdit} className="button button-primary button-small">Save</button>
                          <button onClick={() => setEditingNote(null)} className="button button-secondary button-small">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="note-title">{note.title}</div>
                        <div className="note-content">{note.content}</div>
                        <div className="note-actions">
                          <button onClick={() => handleEditNote(note)} className="button button-secondary button-small">Edit</button>
                          <button onClick={() => handleDeleteNote(note._id)} className="button button-danger button-small">Delete</button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
