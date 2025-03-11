import { Component, JSX } from "solid-js";
import CloseIcon from "~icons/fe/close";
import { Popover as Kobalte } from "@kobalte/core/popover";

const Popover: Component<{
  trigger: JSX.Element;
  title: string;
  description: JSX.Element | string;
}> = (props) => {
  return (
    <Kobalte>
      <Kobalte.Trigger>{props.trigger}</Kobalte.Trigger>
      <Kobalte.Portal>
        <Kobalte.Content class="rounded bg-cyan-600 p-2 text-white ring-slate-300">
          <Kobalte.Arrow />
          <div class="flex gap-4">
            <Kobalte.Title>{props.title}</Kobalte.Title>
            <Kobalte.CloseButton class="rounded-lg hover:bg-gray-400">
              <CloseIcon />
            </Kobalte.CloseButton>
          </div>
          <Kobalte.Description>{props.description}</Kobalte.Description>
        </Kobalte.Content>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Popover;
