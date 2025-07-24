'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState({ username: 'User' }); // Placeholder user
  const [notes, setNotes] = useState([
    // Sample notes for demonstration
    {
      id: 1,
      title: 'Welcome Note',
      content: 'This is your first note. You can edit or delete it anytime.'
    },
    {
      id: 2,
      title: 'Meeting Notes',
      content: 'Discussed project requirements and timeline.'
    }
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content
      };
      setNotes(prev => [note, ...prev]);
      setNewNote({ title: '', content: '' });
      setIsAddingNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote({ ...note });
  };

  const handleSaveEdit = () => {
    setNotes(prev => prev.map(note => 
      note.id === editingNote.id ? editingNote : note
    ));
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link href="/" className="navbar-brand">
              Simple Audit Log Viewer
            </Link>
            <div className="navbar-nav">
              <span className="text-muted">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="button button-secondary button-small">
                Logout
              </button>
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
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h2 className="card-title">Your Notes</h2>
                <button 
                  onClick={() => setIsAddingNote(true)}
                  className="button button-primary"
                  disabled={isAddingNote}
                >
                  Add New Note
                </button>
              </div>
            </div>

            {/* Add New Note Form */}
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
                  <button onClick={handleAddNote} className="button button-primary button-small">
                    Save Note
                  </button>
                  <button 
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote({ title: '', content: '' });
                    }}
                    className="button button-secondary button-small"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="note-list">
              {notes.length === 0 ? (
                <div className="text-center text-muted" style={{ padding: '2rem' }}>
                  <p>No notes yet. Create your first note to get started!</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="note-item">
                    {editingNote && editingNote.id === note.id ? (
                      // Edit Mode
                      <div>
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
                          <button onClick={handleSaveEdit} className="button button-primary button-small">
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingNote(null)}
                            className="button button-secondary button-small"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div>
                        <div className="note-title">{note.title}</div>
                        <div className="note-content">{note.content}</div>
                        <div className="note-actions">
                          <button 
                            onClick={() => handleEditNote(note)}
                            className="button button-secondary button-small"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="button button-danger button-small"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
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
