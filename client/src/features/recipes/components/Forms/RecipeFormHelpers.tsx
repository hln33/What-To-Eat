import { Component, ParentComponent } from "solid-js";
import TrashIcon from "~icons/fe/trash";
import PlusIcon from "~icons/fe/plus";

import Button from "@/components/ui/Button";

export const DeleteFieldButton: Component<{
  ariaLabel: string;
  onClick: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <Button
      class="self-end"
      variant="subtle"
      color="red"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <TrashIcon class="size-6" />
    </Button>
  );
};

export const AddFieldButton: ParentComponent<{
  onClick: () => void;
  ariaLabel?: string;
  disabled: boolean;
}> = (props) => {
  return (
    <Button
      class="mt-3 border-slate-500 text-slate-100"
      variant="outline"
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span class="inline-flex items-center gap-2">
        <PlusIcon class="inline text-slate-300" />
        {props.children}
      </span>
    </Button>
  );
};
