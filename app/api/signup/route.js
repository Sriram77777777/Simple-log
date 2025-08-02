import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    if (username && username.trim().toLowerCase() === 'admin') {
      return NextResponse.json({ message: 'This username is reserved for admin' }, { status: 400 });
    }

    await dbConnect();

    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    if (existingEmailUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    if (username) {
      const existingUsernameUser = await User.findOne({ username: username.trim() });
      if (existingUsernameUser) {
        return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
      }
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: normalizedEmail,
      username: username?.trim() || undefined,
      password: hashedPassword,
    });


    return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
