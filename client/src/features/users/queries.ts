import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";

import { useUserContext } from "@/contexts/UserContext";
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

export const userKeys = {
  all: ["users"],
  session: () => [...userKeys.all, "session"],
  favoriteRecipeList: (id: string) => [...userKeys.all, id, "favoriteRecipes"],
  ingredientsList: (id: string) => [...userKeys.all, id, "ingredients"],
};

export const createUserSessionQuery = () => {
  return createQuery(() => ({
    queryKey: userKeys.session(),
    queryFn: getUserSession,
  }));
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
      queryClient.invalidateQueries({ queryKey: userKeys.session() });
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
      queryClient.invalidateQueries({ queryKey: userKeys.session() });
      user.logout();
    },
  }));
};

export const createUserFavoriteRecipesQuery = () => {
  const user = useUserContext();

  return createQuery(() => ({
    queryKey: userKeys.favoriteRecipeList(user.info.id!),
    queryFn: () => getFavoritedRecipes(user.info.id!),
    enabled: user.info.isLoggedIn,
  }));
};

export const createUserFavoriteRecipeMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: addRecipeToFavorites,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: userKeys.favoriteRecipeList(user.info.id ?? ""),
      }),
  }));
};

export const createUserUnfavoriteRecipeMutation = () => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  return createMutation(() => ({
    mutationFn: removeRecipeFromFavorites,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: userKeys.favoriteRecipeList(user.info.id ?? ""),
      }),
  }));
};

export const createUserIngredientsQuery = () => {
  const user = useUserContext();
  if (user.info.isLoggedIn === false) {
    console.error("cannot fetch ingredients for user that is not logged in.");
  }

  return createQuery(() => ({
    queryKey: userKeys.ingredientsList(user.info.id!),
    queryFn: () => getUserIngredients(user.info.id!),
  }));
};

export const createUserIngredientsMutation = (options: {
  invalidate: boolean;
}) => {
  const queryClient = useQueryClient();
  const user = useUserContext();
  if (user.info.isLoggedIn === false) {
    console.error("cannot add ingredients for user that is not logged in.");
  }

  return createMutation(() => ({
    mutationFn: addUserIngredients,
    onSuccess: () => {
      if (options.invalidate) {
        queryClient.invalidateQueries({
          queryKey: userKeys.ingredientsList(user.info.id!),
        });
      }
    },
  }));
};
