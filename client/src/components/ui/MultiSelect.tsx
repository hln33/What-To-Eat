import { Component, For, JSX, splitProps } from "solid-js";
import { Combobox as Kobalte } from "@kobalte/core/combobox";
import CheckIcon from "~icons/fe/check";
import CloseIcon from "~icons/fe/close";

import InputError from "../InputError";

const MultiSelect: Component<{
  label: string;
  options: string[];
  values?: string[];
  defaultValue: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  leftSection?: JSX.Element;
}> = (props) => {
  const [rootProps] = splitProps(props, [
    "onChange",
    "defaultValue",
    "placeholder",
    "options",
  ]);

  return (
    <Kobalte<string>
      {...rootProps}
      multiple
      value={props.values}
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex items-center justify-start gap-1 rounded px-2 ui-highlighted:bg-sky-700 ui-highlighted:text-white"
          item={props.item}
        >
          <Kobalte.ItemLabel class="capitalize">
            {props.item.rawValue}
          </Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            <CheckIcon />
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <Kobalte.Label class="mb-1 block text-left">{props.label}</Kobalte.Label>
      <Kobalte.Control<string> class="rounded-lg border border-gray-500 bg-white focus-within:ring-2 focus-within:ring-blue-600 ui-invalid:border-red-500">
        {(state) => (
          <div class="relative flex justify-between gap-2 p-3">
            <div class="flex flex-wrap gap-2">
              <For each={state.selectedOptions()}>
                {(option) => (
                  <div class="z-10 flex items-center gap-2 rounded-lg bg-sky-800 px-2 py-1 ring-1 ring-slate-600">
                    <div class="cursor-default">{option}</div>
                    <button
                      aria-label={`Remove ${option} from selection`}
                      class="block rounded-lg hover:bg-gray-500"
                      onClick={() => state.remove(option)}
                    >
                      <CloseIcon class="size-4" />
                    </button>
                  </div>
                )}
              </For>
              <Kobalte.Input class="flex-auto bg-inherit text-black outline-none placeholder:text-slate-400" />
            </div>
            <Kobalte.Trigger class="absolute inset-0 z-0 cursor-text" />
          </div>
        )}
      </Kobalte.Control>
      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error ?? ""} />
      </Kobalte.ErrorMessage>

      <Kobalte.Portal>
        <Kobalte.Content class="z-50 max-h-96 overflow-auto rounded-lg border border-slate-950 bg-white text-black">
          <Kobalte.Listbox class="p-2" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default MultiSelect;
