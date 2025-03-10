import { hc } from "hono/client";
import { AppType } from "../../../server/src";
import { Recipe } from "../types";

type ResponseData<T> = { data: T; error: null } | { data: null; error: string };

const API_URL = "http://localhost:3001";
const api = hc<AppType>(API_URL);

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
}): Promise<ResponseData<string>> => {
  try {
    const res = await api.users.login.$post(
      { form: loginCredentials },
      {
        init: { credentials: "include" },
      },
    );
    if (!res.ok) {
      return { data: null, error: await res.text() };
    }

    return { data: (await res.json()).message, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: "Unknown error." };
  }
};

export const registerUser = async (
  username: string,
  password: string,
): Promise<boolean> => {
  const res = await api.users.register.$post({
    form: { username, password },
  });
  return res.ok;
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
