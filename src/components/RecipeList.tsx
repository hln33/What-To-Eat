import { Component } from "solid-js";
import RecipeListCard from "./RecipeListCard";

const RecipeList: Component = () => {
  return (
    <section class="">
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-2">
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
      </div>
    </section>
  );
};

export default RecipeList;
