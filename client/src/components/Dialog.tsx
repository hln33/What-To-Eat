import { ParentComponent } from "solid-js";
import { Dialog as Kobalte } from "@kobalte/core/dialog";
import Button from "./Button";

const Dialog: ParentComponent<{ triggerTitle: string; dialogTitle: string }> = (
  props,
) => {
  return (
    <Kobalte>
      <Kobalte.Trigger as={Button}>{props.triggerTitle}</Kobalte.Trigger>
      <Kobalte.Portal>
        <Kobalte.Overlay class="fixed inset-0 z-50 bg-black/50">
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <Kobalte.Content class="bg-slate-700 p-8 text-white">
              <div class="mb-5 flex justify-between text-3xl">
                <Kobalte.Title>{props.dialogTitle}</Kobalte.Title>
                <Kobalte.CloseButton class="text-gray-400">
                  X
                </Kobalte.CloseButton>
              </div>
              {props.children}
            </Kobalte.Content>
          </div>
        </Kobalte.Overlay>
      </Kobalte.Portal>
    </Kobalte>
  );
};

export default Dialog;
