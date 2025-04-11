import { children, ParentComponent, Setter } from "solid-js";
import {
  DialogCloseButtonProps,
  Dialog as Kobalte,
} from "@kobalte/core/dialog";
import CloseIcon from "~icons/fe/close";

import Button from "./Button";

const Dialog: ParentComponent<{ open?: boolean; setOpen?: Setter<boolean> }> = (
  props,
) => {
  const renderChildren = () => {
    const resolvedChildren = children(() => props.children).toArray();
    console.assert(
      resolvedChildren.length === 2,
      `Expected 2 children; Trigger and Content. Recieved ${resolvedChildren.length} children`,
    );
    return resolvedChildren;
  };

  return (
    <Kobalte
      open={props.open}
      onOpenChange={props.setOpen}
    >
      {renderChildren()}
    </Kobalte>
  );
};

const DialogTrigger = Kobalte.Trigger;

const DialogContent: ParentComponent<{ title: string }> = (props) => {
  return (
    <Kobalte.Portal>
      <Kobalte.Overlay class="fixed inset-0 z-40 bg-black/60">
        <div class="absolute inset-0 flex items-center justify-center">
          <Kobalte.Content class="relative rounded-md bg-slate-700 p-8 text-white">
            <div class="mb-8 flex justify-between text-3xl">
              <Kobalte.Title>{props.title}</Kobalte.Title>
              <Kobalte.CloseButton
                as={(props: DialogCloseButtonProps) => (
                  <Button
                    class="absolute right-4 top-4 text-gray-200 hover:bg-slate-500"
                    variant="subtle"
                    {...props}
                  >
                    <CloseIcon class="size-6" />
                  </Button>
                )}
              />
            </div>
            <div class="space-y-8">{props.children}</div>
          </Kobalte.Content>
        </div>
      </Kobalte.Overlay>
    </Kobalte.Portal>
  );
};

export { Dialog, DialogTrigger, DialogContent };
