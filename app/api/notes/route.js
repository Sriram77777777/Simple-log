import { NextResponse } from 'next/server';
import User from '@/app/models/User';
import Log from '@/app/models/Log';
import { cookies } from 'next/headers';
import dbConnect from '@/app/lib/db';
import Note from '@/app/models/Note';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
    }

    const parsed = JSON.parse(session.value || '{}');
    const userId = parsed.userId;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized - No user ID in session' }, { status: 401 });
    }

    await dbConnect();

    const notes = await Note.find({ userId });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error('GET /api/notes error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
export async function POST(req) {
  const cookieStore = await cookies(); // ✅ correct
  const sessionCookie = cookieStore.get('session');


  if (!sessionCookie) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch (err) {
    return NextResponse.json({ message: 'Invalid session data' }, { status: 401 });
  }

  const { username } = session;
  if (!username) {
    return NextResponse.json({ message: 'Unauthorized - No username in session' }, { status: 401 });
  }

  const { title, content } = await req.json();

  await dbConnect();

  // ✅ Find the user by username to get userId
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // ✅ Create the note with userId
  const note = await Note.create({
    title,
    content,
    userId: user._id,
  });

  // ✅ Log the action
  await Log.create({ username, action: 'ADD_NOTE' });

  return NextResponse.json({ message: 'Note created', note }, { status: 201 });
}