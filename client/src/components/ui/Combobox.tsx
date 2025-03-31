import { Component, JSX, Setter, Show, splitProps } from "solid-js";
import { Combobox as Kobalte } from "@kobalte/core/combobox";
import CheckIcon from "~icons/fe/check";
import ChevronDownIcon from "~icons/lucide/chevron-down";

import InputError from "../InputError";
import RequiredInputLabel from "../RequiredInputLabel";

type UncontrolledProps = {
  controlled?: false;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
};
type ControlledProps = {
  controlled: true;
  onChange: Setter<string>;
};

const Combobox: Component<
  {
    class?: string;
    label?: string;
    options: string[];
    value: string | undefined;
    placeholder?: string;
    error?: string;
  } & JSX.SelectHTMLAttributes<HTMLSelectElement> &
    (ControlledProps | UncontrolledProps)
> = (props) => {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "required"],
  );

  return (
    <Kobalte<string>
      {...rootProps}
      class={props.class ?? ""}
      onChange={props.controlled ? props.onChange : undefined}
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
      <Show when={props.label}>
        <Kobalte.Label class="mb-1 block text-left text-xl">
          {props.required ? (
            <RequiredInputLabel label={props.label!} />
          ) : (
            props.label
          )}
        </Kobalte.Label>
      </Show>

      <Show when={!props.controlled}>
        <Kobalte.HiddenSelect {...selectProps} />
      </Show>
      <Kobalte.Control<string> class="h-12 rounded-lg border border-gray-500 bg-white focus-within:ring-2 focus-within:ring-blue-600 ui-invalid:border-red-500">
        <div class="relative flex w-full items-center gap-2 p-3 text-black">
          <Kobalte.Input
            class="w-full bg-inherit outline-none placeholder:text-slate-400"
            aria-label={props["aria-label"]}
          />
          <ChevronDownIcon />
          <Kobalte.Trigger class="absolute inset-0 z-0 cursor-text" />
        </div>
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

export default Combobox;
