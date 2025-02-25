import { Component, JSX, Show, splitProps } from "solid-js";
import { TextField as Kobalte } from "@kobalte/core/text-field";
import InputError from "./InputError";
import RequiredInputAsterisk from "./RequiredInputAsterisk";

type TextInputProps = {
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date";
  class?: string;
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error: string;
  required?: boolean;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

const TextField: Component<TextInputProps> = (props) => {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <Kobalte
      class={`flex flex-col items-start gap-1 ${props.class}`}
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <Kobalte.Label>
          {props.label} {rootProps.required && <RequiredInputAsterisk />}
        </Kobalte.Label>
      </Show>
      <Kobalte.Input
        class="w-52 rounded-md px-2 py-3 text-black ui-invalid:border-2 ui-invalid:border-red-500 ui-invalid:text-red-500 ui-disabled:bg-slate-500"
        {...inputProps}
        type={props.type}
      />
      <Kobalte.ErrorMessage>
        <InputError errorMessage={props.error} />
      </Kobalte.ErrorMessage>
    </Kobalte>
  );
};

export default TextField;
