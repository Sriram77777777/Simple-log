import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
const session = cookieStore.get('session');

  if (!session) {
    return NextResponse.json({ isLoggedIn: false, username: null }, { status: 200 });
  }

  try {
    const parsed = JSON.parse(session.value);
    return NextResponse.json({ isLoggedIn: true, username: parsed.username }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ isLoggedIn: false, username: null }, { status: 400 });
  }
}
