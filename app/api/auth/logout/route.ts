// app/api/auth/logout/route.ts

import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookie = serialize('auth_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  });

  // Gunakan NextResponse.json untuk membuat respons
  return NextResponse.json(
    { success: true, message: 'Logout berhasil.' },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    }
  );
}