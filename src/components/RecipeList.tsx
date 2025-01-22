import { Component } from "solid-js";
import RecipeListCard from "./RecipeListCard";

const RecipeList: Component = () => {
  return (
    <section class="border">
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <RecipeListCard
        name="Fried Garlic"
        requiredIngredients={new Set([])}
        providedIngredients={new Set([])}
      />
      <RecipeListCard
        name="Fried Garlic"
        requiredIngredients={new Set(["garlic", "olive oil"])}
        providedIngredients={new Set(["garlic"])}
      />
      <RecipeListCard
        name="Fried Garlic"
        requiredIngredients={new Set(["onion, parsley"])}
        providedIngredients={new Set([])}
      />
    </section>
  );
};

export default RecipeList;
