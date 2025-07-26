import { NextResponse } from 'next/server';
import { connectToDatabase as dbConnect } from '@/app/lib/db';
import Note from '@/app/models/Note';
import Log from '@/app/models/Log';
import { cookies } from 'next/headers';


// ✅ Helper to extract ID from URL
function getNoteIdFromRequestUrl(request) {
  const url = new URL(request.url);
  return url.pathname.split('/').pop(); // gets [id] from /api/notes/[id]
}

export async function PUT(req) {
  const cookieStore =await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  const session = JSON.parse(sessionCookie.value || '{}');
  const { username } = session;
  if (!username) {
    return NextResponse.json({ message: 'Unauthorized - No username in session' }, { status: 401 });
  }

  const noteId = getNoteIdFromRequestUrl(req); // ✅ get ID from URL
  const { title, content } = await req.json();

  await dbConnect();

  const note = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true }
  );

  if (!note) {
    return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  }

  await Log.create({ username, action: 'EDIT_NOTE' });

  return NextResponse.json({ message: 'Note updated', note }, { status: 200 });
}


export async function DELETE(req, context) {
  const cookieStore = await cookies(); // ✅ await cookies()
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  const { username, userId } = JSON.parse(sessionCookie.value);
   const noteId = getNoteIdFromRequestUrl(req);  // ✅ use context.params.id properly

  await dbConnect();

  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!deletedNote) {
    return NextResponse.json({ message: 'Note not found or unauthorized' }, { status: 404 });
  }

  await Log.create({ username, action: 'DELETE_NOTE' });

  return NextResponse.json({ message: 'Note deleted successfully' });
}
