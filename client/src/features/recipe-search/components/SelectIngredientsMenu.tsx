import { Component, Index } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import SelectIngredients from "./SelectIngredients";

type Category = {
  name: string;
  options: Set<string>;
  ingredients: Set<string>;
  onIngredientsChange: (ingredients: Set<string>) => void;
};

const SelectIngredientsMenu: Component<{ categories: Category[] }> = (
  props,
) => {
  return (
    <Dialog open>
      <Dialog.Trigger>Ingredients</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed left-0 top-0 z-50 w-72 bg-slate-700 p-8">
          <Dialog.Content>
            <div class="space-y-8">
              <Index each={props.categories}>
                {(category, _index) => (
                  <SelectIngredients
                    categoryName={category().name}
                    value={category().ingredients}
                    onChange={category().onIngredientsChange}
                    options={category().options}
                  />
                )}
              </Index>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog>
  );
};

export default SelectIngredientsMenu;
