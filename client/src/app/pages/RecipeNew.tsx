import { useNavigate } from "@solidjs/router";

import { postNewRecipe } from "@/features/recipes/api";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";

const RecipeNewPage = () => {
  const navigate = useNavigate();

  const handleNewRecipeSubmit = async (values: SubmittedRecipeForm) => {
    const recipe = await postNewRecipe(values);
    if (recipe) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return <NewRecipeForm onSubmit={handleNewRecipeSubmit} />;
};

export default RecipeNewPage;
