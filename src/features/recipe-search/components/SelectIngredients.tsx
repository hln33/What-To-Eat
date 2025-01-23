import { Select } from "@kobalte/core/select";
import { Component, For } from "solid-js";

const SelectIngredients: Component<{
  categoryName: string;
  value: Set<string>;
  onChange: (newValues: Set<string>) => void;
  options: Set<string>;
}> = (props) => {
  const handleChange = (value: string[]) => {
    props.onChange(new Set(value));
  };

  return (
    <div class="flex flex-col items-center">
      <label
        class="mb-4 block text-4xl"
        for="essentials"
      >
        {props.categoryName}
      </label>

      <Select<string>
        id="essentials"
        multiple
        value={Array.from(props.value)}
        onChange={handleChange}
        options={Array.from(props.options)}
        itemComponent={(props) => (
          <Select.Item
            class="flex cursor-pointer justify-between gap-2 rounded-md p-2 ui-highlighted:bg-pink-500"
            item={props.item}
          >
            <Select.ItemLabel>
              {props.item.rawValue.toString()}
            </Select.ItemLabel>
            <Select.ItemIndicator>X</Select.ItemIndicator>
          </Select.Item>
        )}
      >
        <Select.Trigger
          class="min-h-12 w-64 rounded-md border border-zinc-500 bg-zinc-900"
          as="div"
        >
          <Select.Value<string>>
            {(state) => (
              <div class="flex flex-wrap gap-2 p-2">
                <For each={state.selectedOptions()}>
                  {(option) => (
                    <>
                      <div
                        class="flex items-center gap-2 rounded-md bg-gray-700 px-2 py-1"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        {option}
                        <button
                          class="flex size-5 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-400"
                          onClick={() => state.remove(option)}
                        >
                          X
                        </button>
                      </div>
                    </>
                  )}
                </For>
              </div>
            )}
          </Select.Value>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content class="rounded-md border border-zinc-500 bg-zinc-900 p-2 text-white">
            <Select.Listbox />
          </Select.Content>
        </Select.Portal>
      </Select>
    </div>
  );
};

export default SelectIngredients;
