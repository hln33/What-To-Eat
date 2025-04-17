import { Component, JSX } from "solid-js";

const Input: Component<
  { leftSection?: JSX.Element } & JSX.InputHTMLAttributes<HTMLInputElement>
> = (props) => {
  return (
    <div class="flex h-12 w-full items-center gap-2 rounded-md bg-white px-2 text-black has-[:focus]:ring has-[:focus]:ring-blue-600">
      {props.leftSection}
      <input
        class="size-full outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;
