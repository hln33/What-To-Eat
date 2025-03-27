import { api, callRPC } from "@/api";
import { Credentials } from "./types";

export const login = async (
  loginCredentials: Credentials,
): Promise<{ userId: string; username: string }> => {
  return await callRPC(
    api.users.login.$post(
      { form: loginCredentials },
      {
        init: { credentials: "include" },
      },
    ),
  );
};

export const registerUser = async (
  credentials: Credentials,
): Promise<{ message: string }> => {
  return await callRPC(
    api.users.register.$post({
      form: credentials,
    }),
  );
};

export const logout = async (): Promise<boolean> => {
  const res = await api.users.logout.$post(undefined, {
    init: { credentials: "include" },
  });
  return res.ok;
};

/**
 * Returns information about the current user if they are logged in via their session cookie.
 */
export const getUserSession = async (): Promise<{
  userId: string;
  username: string;
} | null> => {
  try {
    return await callRPC(
      api.users.session.$get(undefined, {
        init: { credentials: "include" },
      }),
    );
  } catch {
    return null;
  }
};
