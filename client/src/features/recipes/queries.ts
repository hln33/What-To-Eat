import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import {
  deleteRecipe,
  getAllRecipes,
  getRecipe,
  postNewRecipe,
  postRecipeImage,
  updateRecipe,
} from "./api";

const recipeKeys = {
  all: ["recipes"] as const,
  list: () => [...recipeKeys.all, "list"],
  detail: (id: string) => [...recipeKeys.all, id] as const,
};

export const createAllRecipesQuery = () => {
  return createQuery(() => ({
    queryKey: recipeKeys.all,
    queryFn: getAllRecipes,
  }));
};

export const createRecipeQuery = (id: string) => {
  return createQuery(() => ({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
  }));
};

export const createAddRecipeMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: postNewRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.list() }),
  }));
};

export const createUpdateRecipeMutation = (id: string) => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: updateRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) }),
  }));
};

export const createDeleteRecipeMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: deleteRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeKeys.list() }),
  }));
};

/**
 * Upload image to a separate API endpoint for UX/DX purposes
 * https://stackoverflow.com/questions/33279153/rest-api-file-ie-images-processing-best-practices
 */
export const createUploadImageMutation = () => {
  return createMutation(() => ({
    mutationFn: postRecipeImage,
  }));
};
