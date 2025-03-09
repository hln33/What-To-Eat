import { Component, For, JSX, splitProps } from "solid-js";
import { Combobox as Kobalte } from "@kobalte/core/combobox";
import InputError from "./InputError";

const Combobox: Component<{
  name: string;
  label: string;
  options: string[];
  placeholder?: string;
  value: string[] | undefined;
  error: string;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
}> = (props) => {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <Kobalte<string>
      {...rootProps}
      multiple
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex justify-start gap-2 rounded px-2 ui-highlighted:bg-sky-700 ui-highlighted:text-white"
          item={props.item}
        >
          <Kobalte.ItemLabel>{props.item.rawValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>Y</Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <Kobalte.Label class="mb-1 block">{props.label}</Kobalte.Label>
      <Kobalte.HiddenSelect {...selectProps} />
      <Kobalte.Control<string> class="rounded-lg border border-gray-500 bg-white focus-within:ring-2 focus-within:ring-blue-600 ui-invalid:border-red-500">
        {(state) => (
          <div class="relative flex justify-between gap-2 p-3">
            <div class="flex flex-wrap gap-2">
              <For each={state.selectedOptions()}>
                {(option) => (
                  <div class="z-10 flex gap-3 rounded-lg bg-sky-800 px-3 py-1 ring-1 ring-slate-600">
                    {option}
                    <button onClick={() => state.remove(option)}>X</button>
                  </div>
                )}
              </For>
              <Kobalte.Input class="flex-auto bg-inherit outline-none placeholder:text-slate-400" />
            </div>
            <Kobalte.Trigger class="absolute inset-0 z-0 cursor-text" />
          </div>
        )}
      </Kobalte.Control>
      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error} />
      </Kobalte.ErrorMessage>

      <Kobalte.Portal>
        <Kobalte.Content class="z-50 rounded-lg border border-slate-950 bg-white text-black">
          <Kobalte.Listbox class="p-2" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Combobox;
