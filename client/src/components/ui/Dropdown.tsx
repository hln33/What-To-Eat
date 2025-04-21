import { ParentComponent } from "solid-js";
import {
  DropdownMenuRadioItemProps as DropdownMenuRadioItemRootProps,
  DropdownMenu as Kobalte,
} from "@kobalte/core/dropdown-menu";
import { OverrideComponentProps } from "@kobalte/core";

import FilledDotIcon from "~icons/fa6-regular/circle-dot";
import OutlineDotIcon from "~icons/fa6-regular/circle";

const Dropdown = Kobalte;

const DropdownTrigger = Kobalte.Trigger;

const DropdownContent: ParentComponent = (props) => {
  return (
    <Kobalte.Portal>
      <Kobalte.Content class="min-w-32 rounded bg-slate-600 px-4 py-2 text-white">
        {props.children}
      </Kobalte.Content>
    </Kobalte.Portal>
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
  props: OverrideComponentProps<"div", DropdownMenuRadioItemRootProps>,
) => {
  return (
    <Kobalte.RadioItem
      class="group relative flex items-center gap-1 py-1 pl-9"
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

const DropdownItem: ParentComponent = (props) => {
  return (
    <Kobalte.Item class="rounded px-2 py-1 focus:bg-slate-400">
      {props.children}
    </Kobalte.Item>
  );
};

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownGroup,
  DropdownGroupLabel,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownItem,
};
