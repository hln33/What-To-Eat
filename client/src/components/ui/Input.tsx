import { Component, JSX } from "solid-js";

const Input: Component<JSX.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      class="h-12 w-full rounded-md px-2 py-3 text-black ui-disabled:bg-slate-500"
      {...props}
    />
  );
};

export default Input;
