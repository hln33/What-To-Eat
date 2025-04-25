import { createFileRoute, useNavigate } from "@tanstack/solid-router";

import { SubmittedRecipeForm } from "@/features/recipes/types";
import NewRecipeForm from "@/features/recipes/components/Forms/NewRecipeForm";
import { createAddRecipeMutation } from "@/features/recipes/queries";

const NewRecipe = () => {
  const navigate = useNavigate();

  const createRecipe = createAddRecipeMutation();
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
