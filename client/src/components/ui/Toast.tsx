import { Component, Match, Switch, ParentComponent } from "solid-js";
import { Portal } from "solid-js/web";
import { Toast as Kobalte, toaster } from "@kobalte/core/toast";
import CheckIcon from "~icons/fe/check-circle";
import ErrorIcon from "~icons/material-symbols/error-circle-rounded";

const Toast: ParentComponent<{ toastId: number }> = (props) => (
  <Kobalte
    toastId={props.toastId}
    class="w-full rounded border border-slate-500 bg-slate-700 text-sm text-white shadow-lg ui-opened:animate-slide-in ui-closed:animate-content-hide"
  >
    {props.children}
  </Kobalte>
);

const ToastContent: ParentComponent = (props) => (
  <div class="flex items-center gap-4 p-3">{props.children}</div>
);

const ToastIcon: Component<{ icon: "check" | "warning" }> = (props) => (
  <div class="relative flex size-8 items-center justify-center">
    <div class="absolute size-1/2 bg-white" />
    <Switch fallback={<div>unexpected icon {props.icon}</div>}>
      <Match when={props.icon === "check"}>
        <CheckIcon class="absolute z-20 size-full *:fill-green-500" />
      </Match>
      <Match when={props.icon === "warning"}>
        <ErrorIcon class="absolute size-full *:fill-red-500" />
      </Match>
    </Switch>
  </div>
);

const ToastTitle: ParentComponent = (props) => (
  <Kobalte.Title class="font-semibold">{props.children}</Kobalte.Title>
);

const ToastDescription: ParentComponent = (props) => (
  <Kobalte.Description class="font-extralight">
    {props.children}
  </Kobalte.Description>
);

const ToastProgress = () => (
  <Kobalte.ProgressTrack class="h-1 rounded bg-gray-500">
    <Kobalte.ProgressFill class="h-full w-[var(--kb-toast-progress-fill-width)] rounded bg-blue-500" />
  </Kobalte.ProgressTrack>
);

const success = (message: string) => {
  return toaster.show((props) => (
    <Toast toastId={props.toastId}>
      <ToastContent>
        <ToastIcon icon={"check"} />

        <div>
          <ToastTitle>Success</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </div>
      </ToastContent>
      <ToastProgress />
    </Toast>
  ));
};

const error = (message: string) => {
  return toaster.show((props) => (
    <Toast toastId={props.toastId}>
      <ToastContent>
        <ToastIcon icon="warning" />

        <div>
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </div>
      </ToastContent>

      <ToastProgress />
    </Toast>
  ));
};

export const ToastRegion = () => {
  return (
    <Portal>
      <Kobalte.Region duration={5000}>
        <Kobalte.List class="fixed top-0 flex w-full flex-col-reverse gap-4 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:w-96" />
      </Kobalte.Region>
    </Portal>
  );
};

export const toast = {
  success,
  error,
};
