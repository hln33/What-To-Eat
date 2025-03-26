import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getCookie, setCookie } from 'hono/cookie';
import type { Session } from '../../models/session.ts';

export const SESSION_COOKIE_NAME = 'session';

export const setSessionCookie = (
  c: Context,
  token: string,
  session: Session
): void =>
  setCookie(c, SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: false, // set to `true` in production
    expires: session.expiresAt,
    sameSite: 'Lax',
  });

export const getSessionCookie = (c: Context): string => {
  const sessionToken = getCookie(c, SESSION_COOKIE_NAME);
  console.log(sessionToken);
  if (!sessionToken) {
    throw new HTTPException(401, { message: 'No session token found.' });
  }
  return sessionToken;
};
