import { Component, ParentComponent, splitProps } from "solid-js";
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenu as Kobalte,
} from "@kobalte/core/dropdown-menu";
import { OverrideComponentProps } from "@kobalte/core";

import FilledDotIcon from "~icons/fa6-regular/circle-dot";
import OutlineDotIcon from "~icons/fa6-regular/circle";
import CheckedSquareIcon from "~icons/lucide/square-check";
import EmptySquareIcon from "~icons/lucide/square";

const Dropdown = Kobalte;

const DropdownTrigger = Kobalte.Trigger;

const DropdownContent: ParentComponent = (props) => {
  return (
    <Kobalte.Portal>
      <Kobalte.Content class="z-50 min-w-32 rounded bg-slate-600 px-4 py-2 text-white shadow-lg">
        {props.children}
        <Kobalte.Arrow
          size={12}
          class="invisible"
        />
      </Kobalte.Content>
    </Kobalte.Portal>
  );
};

const DropdownSeparator: Component = () => {
  return <Kobalte.Separator class="my-2 h-1" />;
};

const DropdownItem: ParentComponent = (props) => {
  return (
    <Kobalte.Item class="rounded px-2 py-1 focus:bg-slate-400">
      {props.children}
    </Kobalte.Item>
  );
};

const DropdownGroup = Kobalte.Group;

const DropdownGroupLabel: ParentComponent = (props) => {
  return (
    <Kobalte.GroupLabel class="font-bold leading-8">
      {props.children}
    </Kobalte.GroupLabel>
  );
};

const DropdownRadioGroup = Kobalte.RadioGroup;

const DropdownRadioItem = (
  props: OverrideComponentProps<"div", DropdownMenuRadioItemProps>,
) => {
  return (
    <Kobalte.RadioItem
      class="group relative flex cursor-pointer items-center gap-1 rounded py-1 pl-9 focus:bg-slate-400"
      value={props.value}
    >
      <div class="absolute left-2 size-4">
        <Kobalte.ItemIndicator>
          <FilledDotIcon class="size-full" />
        </Kobalte.ItemIndicator>
        <OutlineDotIcon class="size-full group-data-[checked]:hidden" />
      </div>
      {props.children}
    </Kobalte.RadioItem>
  );
};

const DropdownCheckboxItem = (
  props: OverrideComponentProps<"div", DropdownMenuCheckboxItemProps>,
) => {
  const [local, rest] = splitProps(props, ["children"]);

  return (
    <Kobalte.CheckboxItem
      {...rest}
      class="group relative flex cursor-pointer items-center rounded py-1 pl-9 focus:bg-slate-400"
    >
      <div class="absolute left-2 size-5">
        <Kobalte.ItemIndicator>
          <CheckedSquareIcon class="size-full" />
        </Kobalte.ItemIndicator>
        <EmptySquareIcon class="size-full group-data-[checked]:hidden" />
      </div>
      {local.children}
    </Kobalte.CheckboxItem>
  );
};

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownSeparator,
  DropdownItem,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownCheckboxItem,
};
