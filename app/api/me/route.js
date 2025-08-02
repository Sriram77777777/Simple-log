import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // adjust path as needed

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ isLoggedIn: false, user: null }, { status: 200 });
  }

  const userInfo = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
  };

  return NextResponse.json({ isLoggedIn: true, user: userInfo }, { status: 200 });
}
