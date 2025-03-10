import { createSignal, Setter, type Component } from "solid-js";
import { setsEqual } from "@/utils/set";
import Dialog from "@/components/Dialog";
import SelectIngredientsMenu from "@/features/ingredients/components/SelectIngredientsMenu";
import NewRecipeForm from "@/features/recipes/components/NewRecipeForm";
import Recipes from "@/features/recipes/components/Recipes";

const HomePage: Component = () => {
  const [essentialIngredients, setEssentialIngredients] = createSignal(
    new Set(["eggs", "olive oil"]),
    { equals: setsEqual },
  );
  const [meatIngredients, setMeatIngredients] = createSignal(new Set([""]), {
    equals: setsEqual,
  });
  const [seafoodIngredients, setSeafoodIngredients] = createSignal(
    new Set([""]),
    { equals: setsEqual },
  );

  const ingredientCategories = () => {
    const createCategory = (
      name: string,
      ingredients: Set<string>,
      onIngredientsChange: Setter<Set<string>>,
      options: Set<string>,
    ) => ({
      name,
      ingredients,
      onIngredientsChange,
      options,
    });

    return [
      createCategory(
        "Essentials",
        essentialIngredients(),
        setEssentialIngredients,
        new Set([
          "butter",
          "milk",
          "eggs",
          "garlic",
          "onion",
          "olive oil",
          "garlic powder",
          "white rice",
        ]),
      ),
      createCategory(
        "Meats",
        meatIngredients(),
        setMeatIngredients,
        new Set(["pork belly", "steak", "chicken breast", "chicken thigh"]),
      ),
      createCategory(
        "Seafood",
        seafoodIngredients(),
        setSeafoodIngredients,
        new Set(["shrimp", "salmon", "prawns", "crab"]),
      ),
    ];
  };

  const allIngredients = () =>
    [essentialIngredients(), meatIngredients(), seafoodIngredients()].reduce(
      (acc, set) => acc.union(set),
    );

  return (
    <div class="flex flex-col justify-around gap-16">
      <SelectIngredientsMenu categories={ingredientCategories()} />
      <Dialog
        triggerTitle="New Recipe"
        dialogTitle="New Recipe"
      >
        <NewRecipeForm />
      </Dialog>

      <Recipes providedIngredients={allIngredients()} />
    </div>
  );
};

export default HomePage;
