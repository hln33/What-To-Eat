import { JSX, ParentComponent } from "solid-js";
import CloseIcon from "~icons/fe/close";
import { Dialog as Kobalte } from "@kobalte/core/dialog";

const Dialog: ParentComponent<{
  trigger: JSX.Element;
  title: string;
}> = (props) => {
  return (
    <Kobalte>
      <Kobalte.Trigger as="div">{props.trigger}</Kobalte.Trigger>

      <Kobalte.Portal>
        <Kobalte.Overlay class="fixed inset-0 z-50 bg-black/60">
          <div class="fixed inset-0 z-50 flex items-center justify-center">
            <Kobalte.Content class="rounded-md bg-slate-700 p-8 text-white">
              <div class="mb-5 flex justify-between text-3xl">
                <Kobalte.Title>{props.title}</Kobalte.Title>
                <Kobalte.CloseButton class="rounded-lg text-gray-200 hover:bg-slate-500">
                  <CloseIcon />
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
