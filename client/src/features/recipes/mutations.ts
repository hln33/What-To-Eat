import { createMutation } from "@tanstack/solid-query";
import { deleteRecipe, postRecipeImage } from "./api";

export const useDeleteRecipe = () => {
  return createMutation(() => ({
    mutationFn: deleteRecipe,
  }));
};

/**
 * Upload image to a separate API endpoint for UX/DX purposes
 * https://stackoverflow.com/questions/33279153/rest-api-file-ie-images-processing-best-practices
 */
export const createUploadImageMutation = () =>
  createMutation(() => ({
    mutationFn: postRecipeImage,
  }));
