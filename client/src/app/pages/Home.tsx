import {
  createSignal,
  ErrorBoundary,
  Suspense,
  type Component,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";
import Recipes from "@/features/recipes/components/Recipes";
import { getAllIngredients } from "@/features/ingredients/api";
import { SubmittedRecipeForm } from "@/features/recipes/types";
import { postNewRecipe } from "@/features/recipes/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
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

  const handleNewRecipeSubmit = async (values: SubmittedRecipeForm) => {
    const recipe = await postNewRecipe(values);
    if (recipe) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <div class="flex flex-col justify-around gap-8">
      <h2 class="mb-5 text-4xl">Recipes</h2>

      <Dialog>
        <DialogTrigger>
          <Button fullWidth>New Recipe</Button>
        </DialogTrigger>
        <DialogContent title="New Recipe">
          <NewRecipeForm onSubmit={handleNewRecipeSubmit} />
        </DialogContent>
      </Dialog>

      <div class="flex items-end gap-3">
        <Input
          type="text"
          placeholder="type in amount..."
        />
        {/* <Select
          name="units"
          placeholder="Select a unit..."
          options={["g", "kg", "mL"]}
        />
        <Select
          placeholder="Search an ingredient..."
          options={["apple", "bread", "banana"]}
        /> */}
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
