import { ParentComponent, JSX, splitProps } from "solid-js";
import { Button as Kobalte } from "@kobalte/core/button";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "h-fit max-h-28 rounded-2xl px-4 py-2 text-xl capitalize",
  {
    variants: {
      color: {
        red: "",
        default: "bg-slate-600 hover:bg-slate-500",
      },
      variant: {
        outline: "bg-black/20 border",
        filled: "text-white",
        subtle: "bg-transparent border-none",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      {
        color: "red",
        variant: "outline",
        class: "bg-black/20 text-red-500 border-red-500 hover:bg-red-500/20",
      },
      {
        color: "red",
        variant: "filled",
        class: "bg-red-500 hover:bg-red-800",
      },
    ],
    defaultVariants: {
      color: "default",
      variant: "filled",
      fullWidth: false,
    },
  },
);

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button: ParentComponent<Props> = (props) => {
  const [local, HTMLAttributes] = splitProps(props, ["children", "fullWidth"]);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={twMerge(
        buttonVariants({
          color: props.color,
          variant: props.variant,
          fullWidth: local.fullWidth,
        }),
      )}
    >
      {local.children}
    </Kobalte>
  );
};

export default Button;
