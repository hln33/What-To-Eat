import { api, callRPC } from "@/api";
import { Credentials } from "./types";

export const login = async (
  loginCredentials: Credentials,
): Promise<{ message: string }> => {
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

export const checkUserSessionExists = async (): Promise<boolean> => {
  const res = await api.users.session.exists.$get(undefined, {
    init: { credentials: "include" },
  });
  return res.ok;
};
