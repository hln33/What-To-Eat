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
  return {
    id: newUser.id,
    username: newUser.username,
    passwordHash: newUser.passwordHash,
  };
};

export const userExists = async (username: string): Promise<boolean> => {
  const res = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username));

  return res.length > 0;
};
