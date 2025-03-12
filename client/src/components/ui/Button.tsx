import { Button as Kobalte } from "@kobalte/core/button";
import { ParentComponent, JSX, splitProps } from "solid-js";

type Color = "red";
type Variant = "outline";

const COLORS = {
  red: "border-red-500",
} as const;

const TEXT_COLORS = {
  red: "text-red-500",
  default: "text-white",
} as const;

const BACKGROUND_COLORS = {
  red: "bg-red-500",
  outline: "bg-black/20",
  default: "bg-slate-600",
} as const;

const OUTLINE_HOVER_COLORS = {
  red: "hover:bg-red-500/20",
} as const;

const HOVER_COLORS = {
  red: "hover:bg-red-800",
  default: "hover:bg-slate-500",
} as const;

const getColor = (color?: Color) => (color ? COLORS[color] : "");

const getTextColor = (color?: Color, variant?: Variant) => {
  if (color && variant === "outline") {
    return TEXT_COLORS[color];
  }
  return TEXT_COLORS.default;
};

const getBackgroundColor = (color?: Color, variant?: Variant) => {
  if (variant === "outline") {
    return BACKGROUND_COLORS.outline;
  }
  return color ? BACKGROUND_COLORS[color] : BACKGROUND_COLORS.default;
};

const getHoverBackgroundColor = (color?: Color, variant?: Variant) => {
  if (!color) return HOVER_COLORS.default;

  return variant == "outline"
    ? OUTLINE_HOVER_COLORS[color]
    : HOVER_COLORS[color];
};

const Button: ParentComponent<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    full?: boolean;
    variant?: "outline";
    color?: Color;
  }
> = (props) => {
  const [local, HTMLAttributes] = splitProps(props, ["children", "full"]);

  const color = () => getColor(props.color);
  const textColor = () => getTextColor(props.color, props.variant);
  const backgroundColor = () => getBackgroundColor(props.color, props.variant);
  const backgroundHoverColor = () =>
    getHoverBackgroundColor(props.color, props.variant);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={`${local.full ? "w-full" : ""} ${color()} ${textColor()} ${backgroundColor()} ${backgroundHoverColor()} ${props.variant === "outline" ? "border" : ""} h-fit max-h-28 rounded-2xl px-4 py-2 text-xl capitalize`}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
