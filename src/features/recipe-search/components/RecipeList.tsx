import { Component } from "solid-js";
import RecipeListCard from "./RecipeListCard";

const RecipeList: Component<{ providedIngredients: Set<string> }> = (props) => {
  return (
    <section class="">
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-4">
        <RecipeListCard
          id={1}
          name="Fried Garlic"
          requiredIngredients={new Set(["Garlic"])}
          providedIngredients={props.providedIngredients}
        />
        <RecipeListCard
          id={2}
          name="Fried Garlic and Onion"
          requiredIngredients={new Set(["Garlic", "Onion"])}
          providedIngredients={props.providedIngredients}
        />
        <RecipeListCard
          id={3}
          name="Fried Garlic and Parsley"
          requiredIngredients={new Set(["Onion, Parsley"])}
          providedIngredients={props.providedIngredients}
        />
      </div>
    </section>
  );
};

export default RecipeList;
