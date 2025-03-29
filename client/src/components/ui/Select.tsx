import { Component, JSX } from "solid-js";
import { Select as Kobalte } from "@kobalte/core/select";
import CheckIcon from "~icons/fe/check";
import ChevronDownIcon from "~icons/lucide/chevron-down";

const Select: Component<
  { options: string[] } & JSX.InputHTMLAttributes<HTMLSelectElement>
> = (props) => {
  return (
    <Kobalte
      name={props.name}
      options={props.options}
      placeholder={props.placeholder}
      itemComponent={(props) => (
        <Kobalte.Item
          class="flex items-center gap-2 rounded-lg px-2 ui-highlighted:bg-sky-700 ui-highlighted:text-white"
          item={props.item}
        >
          <Kobalte.ItemLabel>{props.item.rawValue}</Kobalte.ItemLabel>
          <Kobalte.ItemIndicator>
            <CheckIcon />
          </Kobalte.ItemIndicator>
        </Kobalte.Item>
      )}
    >
      <div class="space-y-1">
        <Kobalte.Label>My Select Element</Kobalte.Label>
        <Kobalte.HiddenSelect />
        <Kobalte.Trigger class="flex h-12 w-56 max-w-56 items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-black">
          <Kobalte.Value<string> class="ui-placeholder-shown:text-slate-400">
            {(state) => state.selectedOption()}
          </Kobalte.Value>
          <Kobalte.Icon>
            <ChevronDownIcon />
          </Kobalte.Icon>
        </Kobalte.Trigger>
      </div>
      <Kobalte.Portal>
        <Kobalte.Content class="z-50 rounded-lg border border-slate-400 bg-white p-2 shadow-xl">
          <Kobalte.Listbox class="outline-none" />
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Select;
