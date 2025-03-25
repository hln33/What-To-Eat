import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import {
  checkSessionExists,
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
} from '../models/session.ts';
import {
  createUser,
  getUser,
  userExists,
  verifyPassword,
} from '../models/user.ts';
import { userValidator } from '../validators/index.js';
import {
  getSessionCookie,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from './cookies/index.ts';

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
    const sessionToken = getSessionCookie(c);
    deleteCookie(c, SESSION_COOKIE_NAME);

    if (!(await checkSessionExists(sessionToken))) {
      return c.json({ error: 'Session does not exist.' }, 404);
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
    const sessionToken = getSessionCookie(c);

    const { session } = await validateSessionToken(sessionToken);
    if (!session) {
      throw new HTTPException(401, { message: 'Invalid session.' });
    }

    return c.json({ message: 'Session exists.' });
  });
export default users;
