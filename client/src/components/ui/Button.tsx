import { JSX, splitProps, Show } from "solid-js";
import { OverrideComponentProps } from "@kobalte/core/polymorphic";
import { type ButtonRootProps, Button as Kobalte } from "@kobalte/core/button";
import { twMerge } from "tailwind-merge";
import { cva, VariantProps } from "class-variance-authority";
import LoaderCircle from "~icons/lucide/loader-circle";

const buttonVariants = cva(
  "h-fit max-h-28 w-fit rounded-2xl p-3 text-xl capitalize disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      color: {
        red: "text-red-500 hover:bg-red-500/20",
        default: "bg-slate-500 hover:bg-slate-400",
      },
      variant: {
        outline: "bg-black/5 border",
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
        class: "border-red-500",
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

type ButtonProps = ButtonRootProps &
  VariantProps<typeof buttonVariants> & {
    class?: string;
    loading?: boolean;
    children: JSX.Element;
  };

const Button = (props: OverrideComponentProps<"button", ButtonProps>) => {
  const [local, HTMLAttributes] = splitProps(props as ButtonProps, [
    "children",
    "fullWidth",
  ]);

  return (
    <Kobalte
      {...HTMLAttributes}
      class={twMerge(
        buttonVariants({
          color: props.color,
          variant: props.variant,
          fullWidth: local.fullWidth,
        }),
        props.class,
      )}
    >
      <div class="flex items-center justify-center gap-2">
        <Show when={props.loading}>
          <LoaderCircle class="animate-spin" />
        </Show>
        {local.children}
      </div>
    </Kobalte>
  );
};

export default Button;
