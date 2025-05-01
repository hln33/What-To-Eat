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

export const addRecipeToFavorites = async (values: {
  userId: number;
  recipeId: number;
}): Promise<void> => {
  const res = await api.users[":id"].favorites.$post({
    param: { id: values.userId.toString() },
    json: { recipeId: values.recipeId },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }
};

export const removeRecipeFromFavorites = async (values: {
  userId: number;
  recipeId: number;
}): Promise<void> => {
  const res = await api.users[":id"].favorites.$delete({
    param: { id: values.userId.toString() },
    json: { recipeId: values.recipeId },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }
};

export const getFavoritedRecipes = async (
  userId: string,
): Promise<{ recipeId: number }[]> => {
  const res = await api.users[":id"].favorites.$get({
    param: { id: userId },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }

  const jsonData = await res.json();
  return jsonData;
};

export const getUserIngredients = async (userId: string): Promise<string[]> => {
  const res = await api.users[":id"].ingredients.$get({
    param: { id: userId },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }

  return await res.json();
};

export const addUserIngredients = async (values: {
  userId: string;
  ingredientNames: string[];
}): Promise<void> => {
  const res = await api.users[":id"].ingredients.$post({
    param: { id: values.userId },
    json: { ingredientNames: values.ingredientNames },
  });
  if (!res.ok) {
    throw new Error("Server error.");
  }
};
