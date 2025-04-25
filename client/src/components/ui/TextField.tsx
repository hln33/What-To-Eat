import { Component, JSX, Show, splitProps } from "solid-js";
import { TextField as Kobalte } from "@kobalte/core/text-field";
import { twMerge } from "tailwind-merge";

import InputError from "../InputError";

type TextInputProps = {
  class?: string;
  label?: string;
  required?: boolean;
  value: string | undefined;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  error: string;
  icon?: JSX.Element;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

const TextField: Component<TextInputProps> = (props) => {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "aria-label"],
  );

  return (
    <Kobalte
      class={twMerge("flex w-full flex-col items-start", props.class)}
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <Kobalte.Label
          class={`mb-1 text-xl ${props.required ? "after:ml-1 after:text-red-500 after:content-['*']" : ""}`}
        >
          {props.label}
        </Kobalte.Label>
      </Show>

      <div class="relative w-full">
        <Kobalte.Input
          class="h-12 w-full rounded-md p-3 text-black ui-invalid:border-2 ui-invalid:border-red-500 ui-disabled:bg-slate-500"
          {...inputProps}
          type={props.type}
        />
        <Show when={props.icon}>
          <div class="pointer-events-none absolute inset-0 flex items-center justify-end px-4">
            <div class="pointer-events-auto">{props.icon}</div>
          </div>
        </Show>
      </div>

      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error} />
      </Kobalte.ErrorMessage>
    </Kobalte>
  );
};

export default TextField;
