import { createFileRoute, useNavigate } from "@tanstack/solid-router";
import { createMutation } from "@tanstack/solid-query";

import { postNewRecipe } from "@/features/recipes/api";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import NewRecipeForm from "@/features/recipes/components/Forms/NewRecipeForm";

const NewRecipe = () => {
  const navigate = useNavigate();

  const createRecipe = createMutation(() => ({
    mutationFn: postNewRecipe,
  }));
  const handleNewRecipeSubmit = async (values: SubmittedRecipeForm) => {
    createRecipe.mutate(values, {
      onSuccess: (recipe) =>
        navigate({
          to: "/recipes/$recipeId",
          params: { recipeId: recipe.id.toString() },
        }),
    });
  };

  return <NewRecipeForm onSubmit={handleNewRecipeSubmit} />;
};

export const Route = createFileRoute("/recipes/new")({
  component: NewRecipe,
});
