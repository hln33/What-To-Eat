import { Button as Kobalte } from "@kobalte/core/button";
import { ParentComponent, JSX, splitProps } from "solid-js";

const COLORS = {
  red: "border-red-500 text-red-500 hover:bg-red-500/20",
} as const;

const BACKGROUND_COLORS = {
  red: "bg-red-500",
} as const;

const Button: ParentComponent<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
    variant?: "outline";
    color?: keyof typeof COLORS;
  }
> = (props) => {
  const [local, HTMLAttributes] = splitProps(props, ["children", "full"]);

  const color = () => {
    return props.color ? COLORS[props.color] : "bg-slate-600";
  };
  const backgroundColor = () => {
    if (props.variant === "outline") {
      return "bg-transparent";
    }
    return props.color ? BACKGROUND_COLORS[props?.color] : "";
  };

  return (
    <Kobalte
      {...HTMLAttributes}
      class={`${local.full ? "w-full" : ""} ${color()} ${backgroundColor()} ${props.variant === "outline" ? "border" : ""} h-fit max-h-28 rounded-2xl px-4 py-2 text-xl capitalize hover:bg-slate-500`}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
