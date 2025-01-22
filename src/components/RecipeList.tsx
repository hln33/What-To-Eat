import { Component } from "solid-js";
import RecipeListCard from "./RecipeListCard";

const RecipeList: Component<{ providedIngredients: Set<string> }> = (props) => {
  return (
    <section class="">
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-4">
        <RecipeListCard
          name="Fried Garlic"
          requiredIngredients={new Set(["garlic"])}
          providedIngredients={props.providedIngredients}
        />
        <RecipeListCard
          name="Fried Garlic and Onion"
          requiredIngredients={new Set(["garlic", "onion"])}
          providedIngredients={props.providedIngredients}
        />
        <RecipeListCard
          name="Fried Garlic and Parsley"
          requiredIngredients={new Set(["onion, parsley"])}
          providedIngredients={props.providedIngredients}
        />
      </div>
    </section>
  );
};

export default RecipeList;
