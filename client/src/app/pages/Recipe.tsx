import { A, useParams } from "@solidjs/router";
import { type Component } from "solid-js";

const RECIPES = [
  { id: 1, name: "scrambled eggs" },
  { id: 2, name: "fried garlic" },
  { id: 3, name: "boiled eggs" },
];

const RecipePage: Component = () => {
  const params = useParams();
  console.log(Object.keys(params));
  console.log(Object.values(params));

  const recipe = RECIPES[Number(params.id as string) - 1];
  console.log(recipe);

  return (
    <div class="flex justify-center">
      <div class="flex flex-col items-start gap-6">
        <A
          class="text-lg underline"
          href="/"
        >
          Go Back
        </A>

        {/* display id for testing purposes */}
        <p>id:{params.id}</p>
        <h2 class="text-5xl">{recipe.name}</h2>

        <section>
          <h3 class="text-left text-3xl">Ingredients</h3>
          <ul class="list-inside list-disc text-left">
            <li>3 Eggs</li>
            <li>Olive Oil / Butter</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h3 class="text-left text-3xl">Instructions</h3>
          <ul class="list-outside list-decimal space-y-2 text-left">
            <li>
              Crack the eggs into a medium bowl. Whisk until smooth and
              combined, with no streaks of egg white remaining.
            </li>
            <li>
              Brush a small nonstick skillet with olive oil, or melt a little
              butter in a small nonstick skillet. Bring to medium heat.
            </li>
            <li>
              Pour in the eggs, and let them cook for a few seconds without
              stirring. Pull a rubber spatula across the bottom of the pan to
              form large, soft curds of scrambled eggs.
            </li>
            <li>
              Continue cooking over medium-low heat, folding and stirring the
              eggs every few seconds. Scrape the spatula along the bottom and
              sides of the pan often to form more curds and to prevent any part
              of the eggs from drying out.
            </li>
            <li>
              Remove the pan from the heat when the eggs are mostly set, but a
              little liquid egg remains. Season to taste with salt and pepper.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default RecipePage;
