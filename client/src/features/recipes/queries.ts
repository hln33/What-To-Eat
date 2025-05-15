import {
  createMutation,
  queryOptions,
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

export const recipeQueries = {
  all: queryOptions({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...recipeQueries.all.queryKey, id],
      queryFn: () => getRecipe(id),
    }),
};

export const createAddRecipeMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: postNewRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeQueries.all.queryKey }),
  }));
};

export const createUpdateRecipeMutation = (id: string) => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: updateRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: recipeQueries.detail(id).queryKey,
      }),
  }));
};

export const createDeleteRecipeMutation = () => {
  const queryClient = useQueryClient();

  return createMutation(() => ({
    mutationFn: deleteRecipe,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: recipeQueries.all.queryKey }),
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
