import { Component, For, JSX, Setter, Show, splitProps } from "solid-js";
import CheckIcon from "~icons/fe/check";
import CloseIcon from "~icons/fe/close";
import { Combobox as Kobalte } from "@kobalte/core/combobox";
import InputError from "../InputError";
import RequiredInputLabel from "../RequiredInputLabel";

type UncontrolledProps = {
  controlled: false;
  name: string;
  ref: (element: HTMLSelectElement) => void;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
};

type ControlledProps = {
  controlled: true;
  onChange: Setter<string[]>;
  name?: undefined;
  ref?: undefined;
  onInput?: undefined;
  onBlur?: undefined;
};

const Combobox: Component<
  {
    label: string;
    options: string[];
    value: string[] | undefined;
    required?: boolean;
    placeholder?: string;
    error?: string;
  } & (UncontrolledProps | ControlledProps)
> = (props) => {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "required"],
  );

  return (
    <Kobalte<string>
      {...rootProps}
      onChange={props.controlled ? props.onChange : undefined}
      multiple
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex items-center justify-start gap-1 rounded px-2 ui-highlighted:bg-sky-700 ui-highlighted:text-white"
          item={props.item}
        >
          <Kobalte.ItemLabel>{props.item.rawValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            <CheckIcon />
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <Kobalte.Label class="mb-1 block">
        {props.required ? (
          <RequiredInputLabel label={props.label} />
        ) : (
          props.label
        )}
      </Kobalte.Label>

      <Show when={!props.controlled}>
        <Kobalte.HiddenSelect {...selectProps} />
      </Show>
      <Kobalte.Control<string> class="rounded-lg border border-gray-500 bg-white focus-within:ring-2 focus-within:ring-blue-600 ui-invalid:border-red-500">
        {(state) => (
          <div class="relative flex justify-between gap-2 p-3">
            <div class="flex flex-wrap gap-2">
              <For each={state.selectedOptions()}>
                {(option) => (
                  <div class="z-10 flex items-center gap-2 rounded-lg bg-sky-800 px-2 py-1 ring-1 ring-slate-600">
                    <div class="cursor-default">{option}</div>
                    <button
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

export default Combobox;
