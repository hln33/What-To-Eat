import { Component, JSX, Show, splitProps } from "solid-js";
import { TextField as Kobalte } from "@kobalte/core/text-field";

import InputError from "../InputError";
import RequiredInputLabel from "../RequiredInputLabel";
import { twMerge } from "tailwind-merge";

type TextInputProps = {
  class?: string;
  value: string | undefined;
  error: string;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  label?: string;
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
      class={twMerge("flex w-full flex-col items-start gap-1", props.class)}
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <Kobalte.Label class="text-xl">
          {rootProps.required ? (
            <RequiredInputLabel label={props.label!} />
          ) : (
            props.label
          )}
        </Kobalte.Label>
      </Show>

      <div class="relative w-full">
        <Kobalte.Input
          class="w-full rounded-md p-3 text-black ui-invalid:border-2 ui-invalid:border-red-500 ui-disabled:bg-slate-500"
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
