import { Component, createEffect, createResource, For } from "solid-js";
import { hc } from "hono/client";
import RecipeListCard from "./RecipeListCard";
import { RecipeType } from "../../../../../server/src/routes/recipes";

const recipeEndpoint = hc<RecipeType>("http://localhost:3001/recipes/");
const fetchAllRecipes = async () => {
  const res = await recipeEndpoint.index.$get();
  return res.json();
};

const RecipeList: Component<{ providedIngredients: Set<string> }> = (props) => {
  const [recipes] = createResource(fetchAllRecipes);
  createEffect(() => {
    if (recipes.error) {
      console.error(recipes.error);
    }
  });

  return (
    <section class="">
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-4">
        <For each={recipes()}>
          {(item, index) => (
            <RecipeListCard
              id={index()}
              name={item.name}
              requiredIngredients={new Set(item.ingredients)}
              providedIngredients={props.providedIngredients}
            />
          )}
        </For>
      </div>
    </section>
  );
};

export default RecipeList;
