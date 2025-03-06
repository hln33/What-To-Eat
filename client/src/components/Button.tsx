import { Button as Kobalte } from "@kobalte/core/button";
import { ParentComponent, JSX, splitProps } from "solid-js";

const Button: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  const [local, HTMLAttributes] = splitProps(props, ["children"]);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={`h-fit max-h-28 rounded bg-slate-600 px-5 py-2 text-xl hover:bg-slate-500 ${props.class}`}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
