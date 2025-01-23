import { type Component } from "solid-js";

const RecipePage: Component = () => {
  return (
    <div class="flex justify-center">
      <div class="flex flex-col items-start gap-6">
        <h2 class="text-5xl">Scrambled Eggs</h2>

        <section>
          <h3 class="text-left text-3xl">Ingredients</h3>
          <ul class="list-inside list-disc">
            <li class="text-left">3 Eggs</li>
            <li class="text-left">Olive Oil / Butter</li>
          </ul>
        </section>

        <section class="space-y-2">
          <h3 class="text-left text-3xl">Instructions</h3>
          <ul class="list-outside list-decimal space-y-2">
            <li class="text-left">
              Crack the eggs into a medium bowl. Whisk until smooth and
              combined, with no streaks of egg white remaining.
            </li>
            <li class="text-left">
              Brush a small nonstick skillet with olive oil, or melt a little
              butter in a small nonstick skillet. Bring to medium heat.
            </li>
            <li class="text-left">
              Pour in the eggs, and let them cook for a few seconds without
              stirring. Pull a rubber spatula across the bottom of the pan to
              form large, soft curds of scrambled eggs.
            </li>
            <li class="text-left">
              Continue cooking over medium-low heat, folding and stirring the
              eggs every few seconds. Scrape the spatula along the bottom and
              sides of the pan often to form more curds and to prevent any part
              of the eggs from drying out.
            </li>
            <li class="text-left">
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
