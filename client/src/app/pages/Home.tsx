import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

import Recipes from "@/features/recipes/components/Recipes";
import { getAllIngredients } from "@/features/ingredients/api";
import MultiSelect from "@/components/ui/MultiSelect";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Combobox from "@/components/ui/Combobox";

const HomePage: Component = () => {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = createSignal<string[]>([]);

  const ingredientsQuery = createQuery(() => ({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
    select: (ingredients) => ingredients.map((i) => i.name).toSorted(),
  }));

  return (
    <div class="flex flex-col justify-around gap-8">
      <h2 class="mb-5 text-4xl">Recipes</h2>

      <Button
        fullWidth
        onClick={() => navigate("recipe/new")}
      >
        New Recipe
      </Button>

      <div class="flex items-end gap-3">
        <Input
          type="text"
          placeholder="type in amount..."
        />
        <Combobox
          controlled
          value=""
          onChange={() => {}}
          label="abc"
          options={["apple", "bread", "banana"]}
        />
      </div>

      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <MultiSelect
            label="Your Ingredients"
            placeholder="Search ingredients"
            options={ingredientsQuery.data ?? []}
            value={ingredients()}
            onChange={setIngredients}
          />
        </Suspense>
      </ErrorBoundary>

      <Recipes providedIngredients={new Set(ingredients())} />
    </div>
  );
};

export default HomePage;
