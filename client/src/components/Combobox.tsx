import { Combobox as Kobalte } from "@kobalte/core/combobox";
import { createSignal, For } from "solid-js";

const ALL_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

const Combobox = () => {
  const [values, setValues] = createSignal(["Blueberry", "Grapes"]);

  return (
    <Kobalte<string>
      multiple
      options={ALL_OPTIONS}
      value={values()}
      onChange={setValues}
      placeholder="Search ingredients"
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex justify-start gap-2 px-2 hover:bg-slate-500"
          item={props.item}
        >
          <Kobalte.ItemLabel>{props.item.rawValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>Y</Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <Kobalte.Control<string> class="rounded-lg border border-gray-500 bg-slate-900 focus-within:border-sky-600">
        {(state) => (
          <div class="relative flex justify-between gap-2 p-3">
            <div class="flex flex-wrap gap-2">
              <For each={state.selectedOptions()}>
                {(option) => (
                  <div class="z-10 flex gap-3 rounded-lg bg-slate-950 px-3 py-1 ring-1 ring-slate-600">
                    {option}
                    <button onClick={() => state.remove(option)}>X</button>
                  </div>
                )}
              </For>
              <Kobalte.Input class="flex-auto bg-inherit outline-none" />
            </div>
            <Kobalte.Trigger class="absolute inset-0 z-0 cursor-text" />
          </div>
        )}
      </Kobalte.Control>

      <Kobalte.Portal>
        <Kobalte.Content class="rounded-lg border border-gray-500 bg-slate-900 text-white">
          <Kobalte.Listbox class="p-2" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Combobox;
