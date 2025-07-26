import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/db';
import Log from '@/app/models/Log';
import { cookies } from 'next/headers';

export async function POST() {
  await connectToDatabase();

  const cookieStore = await cookies();
  const session = cookieStore.get('session');

  let username = '';

  if (session?.value) {
    try {
      const parsed = JSON.parse(session.value);
      username = parsed.username;

      await Log.create({ username, action: 'LOGOUT' });
    } catch (err) {
      console.error('Error parsing session during logout:', err);
    }
  }

  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  // ❗ Proper way to clear the cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Expire immediately
  });

  return response;
}
