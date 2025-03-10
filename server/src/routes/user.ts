import { Hono, type Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import {
  checkSessionExists,
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
  type Session,
} from '../models/session.ts';
import { userValidator } from '../validators/index.js';
import {
  createUser,
  getUser,
  userExists,
  verifyPassword,
} from '../models/user.ts';

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
  .post('/login', zValidator('form', userValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    const user = await getUser(username);

    if (user === null || !(await verifyPassword(username, password))) {
      throw new HTTPException(401, {
        message:
          'Incorrect credentials. Either username or password was incorrect.',
      });
    }

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionCookie(c, token, session);

    return c.json({ message: 'Login successful.' });
  })
  .post('/logout', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE_NAME);
    if (!sessionToken) {
      throw new HTTPException(404, { message: 'No session token found.' });
    }

    deleteCookie(c, SESSION_COOKIE_NAME);
    if (!(await checkSessionExists(sessionToken))) {
      return c.json({ error: 'Session does not exist.' }, 403);
    }
    await invalidateSession(sessionToken);

    return c.json({ message: 'Session invalidated.' });
  })
  .post('/register', zValidator('form', userValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    if (await userExists(username)) {
      throw new HTTPException(409, { message: 'Username already taken' });
    }

    const newUser = await createUser(username, password);
    const token = generateSessionToken();
    const session = await createSession(token, newUser.id);
    setSessionCookie(c, token, session);

    return c.json({ message: 'Registration successful.' });
  })
  .get('/session/exists', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE_NAME);
    if (!sessionToken) {
      throw new HTTPException(404, { message: 'No session token found.' });
    }

    const { session } = await validateSessionToken(sessionToken);
    if (!session) {
      throw new HTTPException(401, { message: 'Invalid session.' });
    }

    return c.json({ message: 'Session exists.' });
  });
export default users;
