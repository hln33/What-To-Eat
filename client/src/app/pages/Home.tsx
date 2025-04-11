import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

import Recipes from "@/features/recipes/components/Recipes";
import { getAllIngredientNames } from "@/features/ingredients/api";
import MultiSelect from "@/components/ui/MultiSelect";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

const HomePage: Component = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = createSignal<string[]>([]);

  const ingredientsQuery = createQuery(() => ({
    queryKey: ["ingredients"],
    queryFn: getAllIngredientNames,
    select: (ingredients) => ingredients.map((i) => i.name).toSorted(),
  }));

  return (
    <div class="flex flex-col justify-around gap-8">
      <h2 class="text-4xl">Recipes</h2>
      <Button
        class="mb-8"
        fullWidth
        onClick={() => navigate("recipe/new")}
      >
        New Recipe
      </Button>

      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <MultiSelect
            controlled
            label="Your Ingredients"
            placeholder="Search ingredients..."
            options={ingredientsQuery.data ?? []}
            onChange={setIngredients}
          />
        </Suspense>
      </ErrorBoundary>
      <Recipes providedIngredients={new Set(ingredients())} />
    </div>
  );
};

export default HomePage;
