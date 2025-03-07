import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { createSession, generateSessionToken } from '../models/session.ts';

const users = new Hono().post('/login', async (c) => {
  const token = generateSessionToken();
  const session = await createSession(token, 1);

  setCookie(c, 'session', token, {
    path: '/',
    httpOnly: true,
    secure: false, // set to `true` in production
    expires: session.expiresAt,
    sameSite: 'Lax',
  });

  return c.text('logged in');
});

export default users;
