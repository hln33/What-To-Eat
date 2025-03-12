import { children, ParentComponent } from "solid-js";
import { Dialog as Kobalte } from "@kobalte/core/dialog";
import CloseIcon from "~icons/fe/close";

const Dialog: ParentComponent = (props) => {
  const renderChildren = () => {
    const resolvedChildren = children(() => props.children).toArray();
    console.assert(
      resolvedChildren.length === 2,
      `Expected 2 children; Trigger and Content. Recieved ${resolvedChildren.length} children`,
    );
    return resolvedChildren;
  };

  return <Kobalte open>{renderChildren()}</Kobalte>;
};

const DialogTrigger = Kobalte.Trigger;

const DialogContent: ParentComponent<{ title: string }> = (props) => {
  return (
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
  );
};

export { Dialog, DialogTrigger, DialogContent };
