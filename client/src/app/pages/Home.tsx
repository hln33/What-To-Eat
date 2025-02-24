import { createSignal, Setter, type Component } from "solid-js";
import RecipeList from "../../features/recipe-search/components/RecipeList";
import SelectIngredientsMenu from "../../features/recipe-search/components/SelectIngredientsMenu";
import { setsEqual } from "../../utils/set";
import NewRecipeForm from "../../features/new-recipe/NewRecipeForm";

const HomePage: Component = () => {
  const [essentialIngredients, setEssentialIngredients] = createSignal(
    new Set(["Eggs", "Olive Oil"]),
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
          "Butter",
          "Milk",
          "Eggs",
          "Garlic",
          "Onion",
          "Olive Oil",
          "Garlic Powder",
          "White Rice",
        ]),
      ),
      createCategory(
        "Meats",
        meatIngredients(),
        setMeatIngredients,
        new Set(["Pork Belly", "Steak", "Chicken Breast", "Chicken Thigh"]),
      ),
      createCategory(
        "Seafood",
        seafoodIngredients(),
        setSeafoodIngredients,
        new Set(["Shrimp", "Salmon", "Prawns", "Crab"]),
      ),
    ];
  };

  const allIngredients = () =>
    [essentialIngredients(), meatIngredients(), seafoodIngredients()].reduce(
      (acc, set) => acc.union(set),
    );

  return (
    <div class="flex flex-col justify-around gap-16 md:flex-row">
      <SelectIngredientsMenu categories={ingredientCategories()} />
      <RecipeList providedIngredients={allIngredients()} />
      <NewRecipeForm />
    </div>
  );
};

export default HomePage;
