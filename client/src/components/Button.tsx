import { Button as Kobalte } from "@kobalte/core/button";
import { ParentComponent, JSX, splitProps } from "solid-js";

const Button: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  const [local, HTMLAttributes] = splitProps(props, ["children"]);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={`rounded bg-slate-600 p-2 text-xl hover:bg-slate-500 ${props.class}`}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
