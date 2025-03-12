import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";
import Recipes from "@/features/recipes/components/Recipes";
import { getAllIngredients } from "@/features/ingredients/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Combobox from "@/components/ui/Combobox";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

const HomePage: Component = () => {
  const [ingredients, setIngredients] = createSignal<string[]>([]);

  const ingredientsQuery = createQuery(() => ({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
    select: (ingredients) => ingredients.map((i) => i.name).toSorted(),
  }));

  return (
    <div class="flex flex-col justify-around gap-8">
      <h2 class="mb-5 text-4xl">Recipes</h2>

      <Dialog>
        <DialogTrigger>
          <Button full>New Recipe</Button>
        </DialogTrigger>
        <DialogContent title="New Recipe">
          <NewRecipeForm />
        </DialogContent>
      </Dialog>

      <ErrorBoundary fallback={<div>{ingredientsQuery.error?.message}</div>}>
        <Suspense fallback={<Skeleton height={40} />}>
          <Combobox
            controlled
            label="Ingredients"
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
