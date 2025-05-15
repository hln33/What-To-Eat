import { Component, Match, Show, Switch } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import ImageIcon from "~icons/lucide/image";
import UserIcon from "~icons/lucide/circle-user-round";
import PeopleIcon from "~icons/lucide/users";
import ClockIcon from "~icons/lucide/clock";
import ShoppingBasketIcon from "~icons/lucide/shopping-basket";
import CheckIcon from "~icons/fe/check";

import Image from "@/components/ui/Image";
import { FetchedRecipe } from "../types";

const getIngredientStatus = (
  requiredIngredients: string[],
  providedIngredients: string[],
) => {
  const numMissing = requiredIngredients.filter(
    (ingredient) => !providedIngredients.includes(ingredient),
  ).length;

  if (numMissing === 0) {
    return "Ready";
  } else if (numMissing === requiredIngredients.length) {
    return "MissingAll";
  } else {
    return "MissingSome";
  }
};

const RecipeCard: Component<{
  recipe: FetchedRecipe;
  providedIngredients: Set<string>;
}> = (props) => {
  const navigate = useNavigate();

  const ingredientStatus = (): "Ready" | "MissingSome" | "MissingAll" =>
    getIngredientStatus(
      props.recipe.ingredients.map((ingredient) => ingredient.name),
      Array.from(props.providedIngredients),
    );

  return (
    <div
      class="flex h-fit w-full cursor-pointer gap-4 border-slate-500 p-4 hover:bg-slate-600"
      onClick={() =>
        navigate({
          to: "/recipes/$recipeId",
          params: { recipeId: props.recipe.id.toString() },
        })
      }
    >
      <div class="flex size-32 shrink-0 items-center justify-center rounded">
        <Show
          when={props.recipe.imageUrl !== null}
          fallback={
            <ImageIcon class="size-full rounded border-slate-400 text-slate-400" />
          }
        >
          <Image
            class="size-full"
            src={props.recipe.imageUrl!}
            fallbackHeight={128}
            fallbackWidth={128}
          />
        </Show>
      </div>

      <div class="flex flex-col gap-2 text-left">
        <div class="flex w-52 justify-between">
          <div class="line-clamp-3 text-ellipsis text-balance text-2xl font-bold">
            {props.recipe.name}
          </div>
          <div class="h-fit rounded-full border px-2 py-1 text-sm">Easy</div>
        </div>

        <Switch fallback={<>unknown ingredient status: {ingredientStatus()}</>}>
          <Match when={ingredientStatus() === "Ready"}>
            <span class="flex items-center gap-2 text-green-500">
              <CheckIcon /> Ready to cook
            </span>
          </Match>
          <Match when={ingredientStatus() === "MissingSome"}>
            <span class="flex items-center gap-2 text-yellow-500">
              <ShoppingBasketIcon />
              Missing some ingredients
            </span>
          </Match>
          <Match when={ingredientStatus() === "MissingAll"}>
            <span class="flex items-center gap-2 text-red-500">
              <ShoppingBasketIcon />
              Missing all ingredients
            </span>
          </Match>
        </Switch>

        <div class="text-md flex gap-6">
          <span class="flex items-center gap-2">
            <ClockIcon class="text-slate-400" />
            25 mins
          </span>
          <span class="flex items-center gap-2">
            <PeopleIcon class="text-slate-400" /> 4 servings
          </span>
        </div>

        <div class="flex items-center gap-2 font-extralight">
          <UserIcon class="text-slate-400" />
          {props.recipe.creator}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
