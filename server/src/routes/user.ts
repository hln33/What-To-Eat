import { Hono, type Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { zValidator } from '@hono/zod-validator';
import {
  checkSessionExists,
  createSession,
  generateSessionToken,
  invalidateSession,
  type Session,
} from '../models/session.ts';
import { newUserValidator } from '../validators/index.js';
import { createUser, userExists } from '../models/user.ts';

const SESSION_COOKIE_NAME = 'session';

const setSessionCookie = (c: Context, token: string, session: Session) =>
  setCookie(c, SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: false, // set to `true` in production
    expires: session.expiresAt,
    sameSite: 'Lax',
  });

const users = new Hono()
  .post('/login', async (c) => {
    const token = generateSessionToken();
    const session = await createSession(token, 1);
    setSessionCookie(c, token, session);

    return c.text('logged in');
  })
  .post('/logout', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE_NAME);
    if (!sessionToken) {
      return c.json({ error: 'No session cookie found.' }, 404);
    }
    deleteCookie(c, SESSION_COOKIE_NAME);

    if (!(await checkSessionExists(sessionToken))) {
      return c.json({ error: 'Session does not exist.' }, 403);
    }
    invalidateSession(sessionToken);

    return c.json({ message: 'Session invalidated.' });
  })
  .post('/register', zValidator('form', newUserValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    if (await userExists(username)) {
      return c.json({ error: 'Username already taken' }, 409);
    }

    const newUser = await createUser(username, password);
    const token = generateSessionToken();
    const session = await createSession(token, newUser.id);
    setSessionCookie(c, token, session);

    return c.json({ message: 'Session created.' });
  })
  .get('/session/exists', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE_NAME);
    if (!sessionToken) {
      return c.json({ error: 'No session cookie found.' }, 404);
    }

    return c.json({ message: 'Session exists.' });
  });
export default users;
