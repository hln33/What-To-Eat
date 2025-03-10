import { ClientResponse, hc } from "hono/client";
import { AppType } from "../../../server/src";
import { Recipe } from "../types";

const API_URL = "http://localhost:3001";
const api = hc<AppType>(API_URL);

const callRPC = async <T>(rpc: Promise<ClientResponse<T>>): Promise<T> => {
  const res = await rpc;
  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage);
  }

  return res.json() as T;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
  const res = await api.recipes[":id"].$get({ param: { id } });

  if (!res.ok) {
    throw new Error(`Recipe with id ${id} does not exist`);
  }
  return res.json();
};

export const getAllRecipes = async (): Promise<Recipe[]> => {
  const res = await api.recipes.$get();
  return res.json();
};

export const postNewRecipe = async ({
  name,
  ingredients,
  instructions,
}: Omit<Recipe, "id">): Promise<Recipe | null> => {
  const res = await api.recipes.$post({
    form: { recipeName: name, ingredients, instructions },
  });
  return res.json();
};

export const login = async (loginCredentials: {
  username: string;
  password: string;
}): Promise<{ message: string }> => {
  return await callRPC(
    api.users.login.$post(
      { form: loginCredentials },
      {
        init: { credentials: "include" },
      },
    ),
  );
};

export const registerUser = async (credentials: {
  username: string;
  password: string;
}): Promise<{ message: string }> => {
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
