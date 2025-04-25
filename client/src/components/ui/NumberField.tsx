import { Component } from "solid-js";
import { NumberField as Kobalte } from "@kobalte/core/number-field";
import { twMerge } from "tailwind-merge";
import PlusIcon from "~icons/lucide/plus";
import MinusIcon from "~icons/lucide/minus";

const NumberField: Component<{
  class?: string;
  label: string;
  required?: boolean;
  value: number | undefined;
  handleRawInputChange: (value: number) => void;
  error: string;
}> = (props) => {
  return (
    <Kobalte
      class={twMerge(`flex w-48 flex-col`, props.class)}
      format={false}
      rawValue={props.value}
      onRawValueChange={props.handleRawInputChange}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Kobalte.Label
        class={`mb-1 text-left text-xl ${props.required ? "after:ml-1 after:text-red-500 after:content-['*']" : ""}`}
      >
        {props.label}
      </Kobalte.Label>
      <div
        class={`flex size-fit rounded outline-blue-500 focus-within:outline ${props.error ? "border border-red-500" : ""}`}
      >
        <Kobalte.DecrementTrigger
          class="flex w-12 items-center justify-center rounded-l bg-slate-600 hover:bg-slate-400 focus:bg-slate-400"
          aria-label="decrement"
        >
          <MinusIcon class="size-4" />
        </Kobalte.DecrementTrigger>
        <Kobalte.Input class="w-16 px-3 py-2 text-black outline-none" />
        <Kobalte.IncrementTrigger
          class="flex w-12 items-center justify-center rounded-r bg-slate-600 hover:bg-slate-400 focus:bg-slate-400"
          aria-label="increment"
        >
          <PlusIcon class="size-4" />
        </Kobalte.IncrementTrigger>
      </div>
      <Kobalte.ErrorMessage class="text-left text-red-500">
        {props.error}
      </Kobalte.ErrorMessage>
    </Kobalte>
  );
};

export default NumberField;
