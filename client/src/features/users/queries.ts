import {
  createMutation,
  queryOptions,
  useQueryClient,
} from "@tanstack/solid-query";

import { User, useUserContext } from "@/contexts/UserContext";
import {
  addRecipeToFavorites,
  addUserIngredients,
  getFavoritedRecipes,
  getUserIngredients,
  getUserSession,
  login,
  logout,
  registerUser,
  removeRecipeFromFavorites,
} from "./api";

const validateUserIsLoggedIn = (user: User, errorMessage: string): void => {
  if (!user.isLoggedIn) {
    throw new Error(errorMessage);
  }
};

export const userQueries = {
  all: ["users"],
  session: () =>
    queryOptions({
      queryKey: [...userQueries.all, "session"],
      queryFn: getUserSession,
    }),
  favoriteRecipesList: (user: User) =>
    queryOptions({
      queryKey: [...userQueries.all, user.id!, "favoriteRecipes"],
      queryFn: () => getFavoritedRecipes(user.id!),
      enabled: user.isLoggedIn,
    }),
  ingredientsList: (user: User) =>
    queryOptions({
      queryKey: [...userQueries.all, user.id!, "ingredients"],
      queryFn: () => getUserIngredients(user.id!),
      enabled: user.isLoggedIn,
    }),
};

export const createUserRegisterMutation = () => {
  return createMutation(() => ({
    mutationFn: registerUser,
  }));
};

export const createUserLoginMutaton = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: userQueries.session().queryKey,
      });
      user.login(data.userId, data.username);
    },
  }));
};

export const createUserLogoutMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.session().queryKey,
      });
      user.logout();
    },
  }));
};

export const createUserFavoriteRecipeMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: (values: { userId: number; recipeId: number }) => {
      validateUserIsLoggedIn(
        user.info,
        "cannot favorite recipe for user that is not logged in.",
      );
      return addRecipeToFavorites(values);
    },
    onSuccess: () => {
      if (user.info.isLoggedIn) {
        queryClient.invalidateQueries({
          queryKey: userQueries.favoriteRecipesList(user.info).queryKey,
        });
      }
    },
  }));
};

export const createUserUnfavoriteRecipeMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: (values: { userId: number; recipeId: number }) => {
      validateUserIsLoggedIn(
        user.info,
        "Cannot unfavorite recipe for user that is not logged in.",
      );
      return removeRecipeFromFavorites(values);
    },
    onSuccess: () => {
      if (user.info.isLoggedIn) {
        queryClient.invalidateQueries({
          queryKey: userQueries.favoriteRecipesList(user.info).queryKey,
        });
      }
    },
  }));
};

export const createAddUserIngredientsMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: (values: { userId: string; ingredientNames: string[] }) => {
      validateUserIsLoggedIn(
        user.info,
        "cannot add ingredients for user that is not logged in.",
      );
      return addUserIngredients(values);
    },
    onSuccess: () => {
      if (user.info.isLoggedIn) {
        queryClient.invalidateQueries({
          queryKey: userQueries.ingredientsList(user.info).queryKey,
        });
      }
    },
  }));
};
