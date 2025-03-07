import * as argon2 from 'argon2';
import { db, sessionTable, userTable } from '../db/schema.ts';
import { type InferSelectModel, eq } from 'drizzle-orm';

type User = InferSelectModel<typeof userTable>;
type Session = InferSelectModel<typeof sessionTable>;

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

const SESSION_TOKEN_BYTE_COUNT = 20;

const getThirtyDaysFromToday = (): Date =>
  new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

export const generateSessionToken = (): string => {
  const bytes = Buffer.alloc(SESSION_TOKEN_BYTE_COUNT);
  crypto.getRandomValues(bytes);
  const token = bytes.toString('base64');
  return token;
};

export const createSession = async (
  token: string,
  userId: number
): Promise<Session> => {
  const sessionId = await argon2.hash(token);
  const session = {
    id: sessionId,
    userId,
    expiresAt: getThirtyDaysFromToday(),
  };

  await db.insert(sessionTable).values(session);
  return session;
};

const validateSessionToken = async (
  token: string
): Promise<SessionValidationResult> => {
  const sessionId = await argon2.hash(token);
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length === 0) {
    return { session: null, user: null };
  }

  const { user, session } = result[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await invalidateSession(session.id);
    return { session: null, user: null };
  }

  const lessThan15DaysBeforeExpiration =
    Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15;
  if (lessThan15DaysBeforeExpiration) {
    session.expiresAt = getThirtyDaysFromToday();
    await db
      .update(sessionTable)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessionTable.id, session.id));
  }

  return { user, session };
};

const invalidateSession = async (sessionId: string): Promise<void> => {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
};

const invalidateAllSessions = async (userId: number): Promise<void> => {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
};

generateSessionToken();
