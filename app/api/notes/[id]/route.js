import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import { connectToDatabase as dbConnect } from '@/app/lib/db';
import Note from '@/app/models/Note';
import Log from '@/app/models/Log';

function getNoteIdFromRequestUrl(request) {
  const url = new URL(request.url);
  return url.pathname.split('/').pop();
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }
  
  const userId = session.user.id;
  const username = session.user.name || session.user.email;

  if (!userId || !username) {
    return NextResponse.json({ message: 'Unauthorized - Missing user info in session' }, { status: 401 });
  }

  const noteId = getNoteIdFromRequestUrl(req);
  const { title, content } = await req.json();

  await dbConnect();

  let note;

  if (userId === 'admin') {
    note = await Note.findOneAndUpdate(
      { _id: noteId },
      { title, content },
      { new: true }
    );
  } else {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true }
    );
  }

  if (!note) {
    return NextResponse.json({ message: 'Note not found or unauthorized' }, { status: 404 });
  }

  await Log.create({ username, action: 'EDIT_NOTE' });

  return NextResponse.json({ message: 'Note updated', note }, { status: 200 });
}


export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  const userId = session.user.id;
  const username = session.user.name || session.user.email;

  if (!userId || !username) {
    return NextResponse.json({ message: 'Unauthorized - Missing user info in session' }, { status: 401 });
  }

  const noteId = getNoteIdFromRequestUrl(req);

  await dbConnect();

  let deletedNote;

  if (userId === 'admin') {
    deletedNote = await Note.findOneAndDelete({ _id: noteId });
  } else {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });
  }

  if (!deletedNote) {
    return NextResponse.json({ message: 'Note not found or unauthorized' }, { status: 404 });
  }

  await Log.create({ username, action: 'DELETE_NOTE' });

  return NextResponse.json({ message: 'Note deleted successfully' });
}
