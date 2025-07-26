import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/app/lib/db';
import User from '@/app/models/User';
import Log from '@/app/models/Log';

export async function POST(req) {
  const { username, password } = await req.json();

  // 1. Admin login (hardcoded)
  if (username === 'admin' && password === 'admin@123') {
    await Log.create({ username, action: 'LOGIN' });

    const response = NextResponse.json(
      { message: 'Admin login success', role: 'admin' },
      { status: 200 }
    );

    response.cookies.set('session', JSON.stringify({ username, role: 'admin' }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  }

  // 2. Normal user login
  await connectToDatabase();

  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  await Log.create({ username, action: 'LOGIN' });

  const response = NextResponse.json({ message: 'Login successful', role: user.role }, { status: 200 });

  response.cookies.set('session', JSON.stringify({ username, role: user.role, userId: user._id.toString() }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return response;
}
