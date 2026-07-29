import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'default-secret-change-me';
const encodedSecret = new TextEncoder().encode(SECRET);

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const session = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedSecret);

  (await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function getUserId() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedSecret);
    return payload.userId as string;
  } catch (e) {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete('session');
}
