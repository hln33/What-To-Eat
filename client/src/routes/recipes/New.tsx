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

  return (
    <div class="space-y-10">
      <h1 class="text-left text-4xl">New Recipe</h1>
      <NewRecipeForm onSubmit={handleNewRecipeSubmit} />
    </div>
  );
};

export const Route = createFileRoute("/recipes/new")({
  component: NewRecipe,
});
