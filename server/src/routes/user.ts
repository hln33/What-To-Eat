import { Hono, type Context } from 'hono';
import { setCookie } from 'hono/cookie';
import {
  createSession,
  generateSessionToken,
  type Session,
} from '../models/session.ts';
import { zValidator } from '@hono/zod-validator';
import { newUserValidator } from '../../validators/index.ts';
import { createUser, userExists } from '../models/user.ts';

const setSessionCookie = (c: Context, token: string, session: Session) =>
  setCookie(c, 'session', token, {
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
  .post('/register', zValidator('form', newUserValidator), async (c) => {
    const { username, password } = c.req.valid('form');
    if (await userExists(username)) {
      return c.json({ error: 'username already taken' }, 409);
    }

    const newUser = await createUser(username, password);
    const token = generateSessionToken();
    const session = await createSession(token, newUser.id);
    setSessionCookie(c, token, session);

    return c.json({});
  });

export default users;
