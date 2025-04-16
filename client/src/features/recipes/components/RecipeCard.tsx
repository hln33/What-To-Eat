import { Component, Match, Show, Switch } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import ImageIcon from "~icons/lucide/image";
import UserIcon from "~icons/lucide/circle-user-round";
import PeopleIcon from "~icons/lucide/users";
import ClockIcon from "~icons/lucide/clock";
import ShoppingBasketIcon from "~icons/lucide/shopping-basket";
import CheckIcon from "~icons/fe/check";

import Image from "@/components/ui/Image";
import { Recipe } from "../types";

const RecipeCard: Component<{
  recipe: Recipe;
  providedIngredients: Set<string>;
}> = (props) => {
  const navigate = useNavigate();

  const ingredientStatus = (): "Ready" | "MissingSome" | "MissingAll" => {
    const numMissing = props.recipe.ingredients.filter(
      (ingredient) => !props.providedIngredients.has(ingredient.name),
    ).length;
    if (numMissing === 0) {
      return "Ready";
    } else if (numMissing === props.recipe.ingredients.length) {
      return "MissingAll";
    } else {
      return "MissingSome";
    }
  };

  return (
    <div
      class="group flex h-fit w-full cursor-pointer gap-4 rounded border border-slate-500 bg-slate-600 p-4 shadow-xl hover:bg-slate-800"
      onClick={() =>
        navigate({
          to: "/recipes/$recipeId",
          params: { recipeId: props.recipe.id.toString() },
        })
      }
    >
      <div class="flex size-32 shrink-0 items-center justify-center rounded bg-slate-400 group-hover:bg-slate-600">
        <Show
          when={props.recipe.imageUrl !== null}
          fallback={<ImageIcon class="size-28 text-slate-200" />}
        >
          <Image
            class="size-full"
            src={props.recipe.imageUrl!}
            fallbackHeight={32}
            fallbackWidth={32}
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

        <div class="text-md flex gap-6">
          <span class="flex items-center gap-2">
            <ClockIcon />
            25 mins
          </span>
          <span class="flex items-center gap-2">
            <PeopleIcon /> 4 servings
          </span>
        </div>

        <Switch fallback={<>unknown ingredient status: {ingredientStatus()}</>}>
          <Match when={ingredientStatus() === "Ready"}>
            <span class="flex items-center gap-2 text-green-500">
              <CheckIcon /> Ready
            </span>
          </Match>
          <Match when={ingredientStatus() === "MissingSome"}>
            <span class="flex items-center gap-2 text-red-500">
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

        <div class="flex items-center gap-2 font-extralight">
          <UserIcon />
          {props.recipe.creator}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
