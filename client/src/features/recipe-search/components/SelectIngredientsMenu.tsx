import { Component, Index } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
import Button from "@/components/Button";
import SelectIngredientsMenuItem from "./SelectIngredientsMenuItem";

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
    <Dialog>
      <Dialog.Trigger as={Button}>Ingredients</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50">
          <div class="left-0 top-0 z-50 w-72 space-y-10 rounded-sm bg-slate-700 p-8">
            <div class="flex justify-between">
              <Dialog.Title class="text-xl text-white">
                Ingredients
              </Dialog.Title>
              <Dialog.CloseButton class="text-gray-400">X</Dialog.CloseButton>
            </div>
            <Dialog.Content>
              <div class="space-y-8">
                <Index each={props.categories}>
                  {(category, _index) => (
                    <SelectIngredientsMenuItem
                      categoryName={category().name}
                      value={category().ingredients}
                      onChange={category().onIngredientsChange}
                      options={category().options}
                    />
                  )}
                </Index>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog>
  );
};

export default SelectIngredientsMenu;
