import { Component, Show, splitProps } from "solid-js";
import { Combobox as Kobalte } from "@kobalte/core/combobox";
import CheckIcon from "~icons/fe/check";
import ChevronDownIcon from "~icons/lucide/chevron-down";

import InputError from "../InputError";

/**
 * A single select combobox.
 */
const Combobox: Component<{
  class?: string;
  label?: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string | null) => void;
  name?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}> = (props) => {
  const [rootProps] = splitProps(props, [
    "name",
    "placeholder",
    "options",
    "onChange",
    "class",
  ]);

  return (
    <Kobalte<string>
      {...rootProps}
      defaultValue={props.value}
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex cursor-pointer items-center justify-start gap-1 rounded px-2 ui-highlighted:bg-sky-700 ui-highlighted:text-white"
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
      <Show when={props.label}>
        <Kobalte.Label
          class={`mb-1 block text-left text-xl ${props.required ? "after:ml-1 after:text-red-500 after:content-['*']" : ""}`}
        >
          {props.label}
        </Kobalte.Label>
      </Show>

      <Kobalte.Control<string> class="h-12 rounded-lg border-gray-500 bg-white focus-within:ring-2 focus-within:ring-blue-600 ui-invalid:border-2 ui-invalid:border-red-500">
        <div class="relative flex w-full items-center gap-2 p-3 text-black">
          <Kobalte.Input class="w-full bg-inherit outline-none placeholder:text-slate-400" />
          <Kobalte.Icon>
            <ChevronDownIcon class="size-5" />
          </Kobalte.Icon>
          <Kobalte.Trigger class="absolute inset-0 z-0 cursor-text" />
        </div>
      </Kobalte.Control>
      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error ?? ""} />
      </Kobalte.ErrorMessage>

      <Kobalte.Portal
        // mount the portal in the currently opened dialog if it exists so that it is accessible
        mount={document.querySelector("[role=dialog]") ?? undefined}
      >
        <Kobalte.Content class="z-50 max-h-96 overflow-auto rounded-lg border border-slate-950 bg-white text-black">
          <Kobalte.Listbox class="p-2" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Combobox;
