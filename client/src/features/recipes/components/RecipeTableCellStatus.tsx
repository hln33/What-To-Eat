import { Component, For, Match, Show, Switch } from "solid-js";
import { CellContext } from "@tanstack/solid-table";
import QuestionIcon from "~icons/fe/question";
import Popover from "@/components/Popover";
import { IngredientStatus, RecipeTableData } from "../types";

const RecipeTableCellStatus: Component<
  CellContext<RecipeTableData, IngredientStatus>
> = (props) => {
  const statusText = () => props.getValue().statusText;
  const shouldShowMissingIngredients = () => statusText() === "MissingSome";

  return (
    <div
      class={`flex justify-between text-white`}
      onClick={(e) => shouldShowMissingIngredients() && e.stopPropagation()}
    >
      <Switch fallback={<span>Error</span>}>
        <Match when={statusText() === "Ready"}>
          <span>Ready to cook</span>
        </Match>
        <Match when={statusText() === "MissingSome"}>
          <span>Missing some</span>
        </Match>
        <Match when={statusText() === "MissingAll"}>
          <span>Missing All Ingredients</span>
        </Match>
      </Switch>

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
