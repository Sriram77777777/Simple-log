import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, password } = await req.json();

  await dbConnect(); // ✅ correct method name

  if (username === 'admin') {
    return NextResponse.json({ message: 'This username is reserved for admin' }, { status: 400 });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  return NextResponse.json({ message: 'Signup successful' }, { status: 201 });
}
