import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/lib/db';
import Log from '@/app/models/Log';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'No active session' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const username = session.user.name || session.user.email;

    await Log.create({ username, action: 'LOGOUT' });

    return NextResponse.json({ message: 'Logout event logged' }, { status: 200 });
  } catch (error) {
    console.error('Error logging logout:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
