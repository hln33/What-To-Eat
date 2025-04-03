import { Component, For } from "solid-js";
import ImageIcon from "~icons/lucide/image";
import UserIcon from "~icons/lucide/circle-user-round";
import PeopleIcon from "~icons/lucide/users";
import ClockIcon from "~icons/lucide/clock";
import CheckIcon from "~icons/fe/check";
import XIcon from "~icons/fe/close";

import { Recipe } from "../types";
import { useNavigate } from "@solidjs/router";

const RecipeCard: Component<{
  recipe: Recipe;
  providedIngredients: Set<string>;
}> = (props) => {
  const navigate = useNavigate();

  return (
    <div
      class="group w-96 cursor-pointer rounded border border-slate-500 bg-slate-600 shadow-xl"
      onClick={() => navigate(`/recipe/${props.recipe.id}`)}
    >
      <div class="flex h-40 items-center justify-center bg-slate-400 group-hover:bg-slate-600">
        <ImageIcon class="size-20" />
      </div>

      <div class="flex flex-col gap-2 p-6 text-left group-hover:bg-slate-800">
        <div class="flex items-center justify-between">
          <div class="text-2xl font-bold">{props.recipe.name}</div>
          <div class="rounded-full border px-2 py-1 text-sm">Easy</div>
        </div>

        <div class="flex items-center gap-2 font-semibold">
          <UserIcon />
          {props.recipe.creator}
        </div>

        <div class="text-md flex gap-6 font-extralight">
          <span class="flex items-center gap-2">
            <ClockIcon />
            25 mins
          </span>
          <span class="flex items-center gap-2">
            <PeopleIcon /> 4 servings
          </span>
        </div>

        <div class="space-y-1">
          <span class="text-xl font-semibold">Ingredients:</span>
          <ul>
            <For each={props.recipe.ingredients}>
              {(ingredient) => {
                const hasIngredient = () =>
                  props.providedIngredients.has(ingredient.name);
                return (
                  <div class="flex items-center gap-2">
                    {hasIngredient() ? (
                      <CheckIcon class="text-green-400" />
                    ) : (
                      <XIcon class="text-red-400" />
                    )}
                    <li class={`${hasIngredient() ? "line-through" : ""}`}>
                      {ingredient.name}
                    </li>
                  </div>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
