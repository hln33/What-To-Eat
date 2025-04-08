import { useNavigate } from "@solidjs/router";

import { postNewRecipe } from "@/features/recipes/api";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";
import { createMutation } from "@tanstack/solid-query";

const RecipeNewPage = () => {
  const navigate = useNavigate();

  const createRecipe = createMutation(() => ({
    mutationFn: postNewRecipe,
  }));
  const handleNewRecipeSubmit = async (values: SubmittedRecipeForm) => {
    createRecipe.mutate(values, {
      onSuccess: (recipe) => navigate(`/recipe/${recipe.id}`),
    });
  };

  return <NewRecipeForm onSubmit={handleNewRecipeSubmit} />;
};

export default RecipeNewPage;
