import {
  Component,
  createEffect,
  createResource,
  ErrorBoundary,
  For,
  Suspense,
} from "solid-js";
import RecipeListCard from "./RecipeListCard";
import Skeleton from "../../../components/Skeleton";
import { getAllRecipes } from "../../../api";

const RecipeList: Component<{
  class?: string;
  providedIngredients: Set<string>;
}> = (props) => {
  const [recipes] = createResource(getAllRecipes);
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
