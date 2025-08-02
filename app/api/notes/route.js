import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/app/lib/db';
import Note from '@/app/models/Note';
import User from '@/app/models/User';
import Log from '@/app/models/Log';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized - No user ID in session' }, { status: 401 });
  }

  await dbConnect();

  let notes;

  if (userId === 'admin') {
    notes = await Note.find({});
  } else {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }
    notes = await Note.find({ userId });
  }

  return NextResponse.json({ notes }, { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized - No session' }, { status: 401 });
  }

  const { title, content } = await req.json();

  const username = session.user.name || session.user.email;
  const userId = session.user.id;

  if (!username || !userId) {
    return NextResponse.json({ message: 'Unauthorized - Missing user info in session' }, { status: 401 });
  }

  await dbConnect();

  if (userId === 'admin') {
    const note = await Note.create({
      title,
      content,
    });

    await Log.create({ username, action: 'ADD_NOTE' });

    return NextResponse.json({ message: 'Note created (admin)', note }, { status: 201 });
  } else {
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const note = await Note.create({
      title,
      content,
      userId,
    });

    await Log.create({ username, action: 'ADD_NOTE' });

    return NextResponse.json({ message: 'Note created', note }, { status: 201 });
  }
}
