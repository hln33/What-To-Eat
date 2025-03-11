import { Component, For, Show } from "solid-js";
import { CellContext } from "@tanstack/solid-table";
import QuestionIcon from "~icons/fe/question";
import Popover from "@/components/Popover";
import { IngredientStatus, RecipeTableData } from "../types";
import { INGREDIENT_STATUSES } from "../utils";

const RecipeTableCellStatus: Component<
  CellContext<RecipeTableData, IngredientStatus>
> = (props) => {
  const statusText = () => props.getValue().statusText;
  const shouldShowMissingIngredients = () =>
    statusText() !== INGREDIENT_STATUSES.ready &&
    statusText() !== INGREDIENT_STATUSES.missingAll;

  return (
    <div
      class="flex text-white"
      onClick={(e) => shouldShowMissingIngredients() && e.stopPropagation()}
    >
      {statusText()}
      <Show when={shouldShowMissingIngredients()}>
        <QuestionIcon class="size-10" />
        <Popover
          trigger={<div class="absolute inset-0" />}
          title="Missing Ingredients:"
          description={
            <ul class="list-inside list-disc">
              <For each={Array.from(props.getValue().missingIngredients)}>
                {(item) => <li>{item}</li>}
              </For>
            </ul>
          }
        />
      </Show>
    </div>
  );
};

export default RecipeTableCellStatus;
