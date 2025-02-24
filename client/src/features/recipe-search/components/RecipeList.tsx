import {
  Component,
  createEffect,
  createResource,
  ErrorBoundary,
  For,
  Suspense,
} from "solid-js";
import { hc } from "hono/client";
import RecipeListCard from "./RecipeListCard";
import { RecipeType } from "../../../../../server/src/routes/recipes";
import Skeleton from "../../../components/Skeleton";

const recipeEndpoint = hc<RecipeType>("http://localhost:3001/recipes/");
const fetchAllRecipes = async () => {
  const res = await recipeEndpoint.index.$get();
  return res.json();
};

const RecipeList: Component<{
  class?: string;
  providedIngredients: Set<string>;
}> = (props) => {
  const [recipes] = createResource(fetchAllRecipes);
  createEffect(() => {
    if (recipes.error) {
      console.error(`Error fetching recipes: ${recipes.error}`);
    }
  });

  return (
    <section class={props.class}>
      <h2 class="mb-5 text-4xl">Recipe List</h2>

      <div class="space-y-4">
        <ErrorBoundary fallback={<div>Error loading recipes</div>}>
          <Suspense
            fallback={
              <>
                <Skeleton height={100} />
                <Skeleton height={100} />
                <Skeleton height={100} />
              </>
            }
          >
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
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
};

export default RecipeList;
