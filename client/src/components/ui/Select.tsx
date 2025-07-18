import { Component, JSX, splitProps } from "solid-js";
import { Select as Kobalte } from "@kobalte/core/select";
import CheckIcon from "~icons/fe/check";
import ChevronDownIcon from "~icons/lucide/chevron-down";
import { twMerge } from "tailwind-merge";

import InputError from "../InputError";

const Select: Component<
  {
    class?: string;
    label: string;
    required?: boolean;
    error: string;
    options: string[];
    defaultValue: string;
  } & JSX.InputHTMLAttributes<HTMLSelectElement>
> = (props) => {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options", "required", "disabled", "defaultValue"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <Kobalte
      {...rootProps}
      class={twMerge("w-full", props.class)}
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex items-center gap-2 rounded-lg px-2 text-black ui-highlighted:bg-sky-700 ui-highlighted:text-white"
          item={props.item}
        >
          <Kobalte.ItemLabel>{props.item.rawValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            <CheckIcon />
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <Kobalte.HiddenSelect {...selectProps} />
      <div class="space-y-1 text-left">
        <Kobalte.Label
          class={`text-xl ${props.required ? "after:ml-1 after:text-red-500 after:content-['*']" : ""}`}
        >
          {props.label}
        </Kobalte.Label>
        <Kobalte.Trigger class="flex h-12 w-full items-center justify-between rounded-lg bg-white p-3 text-left text-black ui-invalid:border-2 ui-invalid:border-red-500">
          <Kobalte.Value<string> class="ui-placeholder-shown:text-slate-400">
            {(state) => state.selectedOption()}
          </Kobalte.Value>
          <Kobalte.Icon>
            <ChevronDownIcon class="size-5" />
          </Kobalte.Icon>
        </Kobalte.Trigger>
      </div>
      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error} />
      </Kobalte.ErrorMessage>

      <Kobalte.Portal
        // mount the portal in the currently opened dialog if it exists so that it is accessible
        mount={document.querySelector("[role=dialog]") ?? undefined}
      >
        <Kobalte.Content class="z-50 rounded-lg border border-slate-400 bg-white p-2 shadow-xl">
          <Kobalte.Listbox class="outline-none" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Select;
