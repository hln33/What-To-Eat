import { Button as Kobalte } from "@kobalte/core/button";
import { ParentComponent, JSX, splitProps } from "solid-js";

const Button: ParentComponent<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & { full?: boolean }
> = (props) => {
  const [local, HTMLAttributes] = splitProps(props, ["children", "full"]);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={`${local.full ? "w-full" : ""} h-fit max-h-28 rounded-2xl bg-slate-600 px-5 py-2 text-xl capitalize hover:bg-slate-500 ${props.class}`}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
