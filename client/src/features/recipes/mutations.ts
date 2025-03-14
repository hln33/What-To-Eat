import { createMutation } from "@tanstack/solid-query";
import { deleteRecipe } from "./api";

export const useDeleteRecipe = () => {
  return createMutation(() => ({
    mutationFn: deleteRecipe,
  }));
};
