import * as argon2 from 'argon2';
import { type InferSelectModel, eq } from 'drizzle-orm';
import { db, userTable } from '../db/schema.ts';

export type User = InferSelectModel<typeof userTable>;

export const createUser = async (
  username: string,
  password: string
): Promise<User> => {
  const hashedPassword = await argon2.hash(password);

  const res = await db
    .insert(userTable)
    .values({ username, passwordHash: hashedPassword })
    .returning();
  if (res.length === 0) {
    console.error('Error inserting user into table.');
  }

  const newUser = res[0];
  return newUser;
};

export const userExists = async (username: string): Promise<boolean> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  return res.length > 0;
};

export const getUser = async (username: string): Promise<User | null> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  if (res.length === 0) {
    return null;
  }

  return res[0];
};

export const verifyPassword = async (
  username: string,
  password: string
): Promise<boolean> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));
  if (res.length === 0) {
    return false;
  }

  const user = res[0];
  return await argon2.verify(user.passwordHash, password);
};
