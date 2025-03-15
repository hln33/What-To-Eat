import { Toast, toaster } from "@kobalte/core/toast";
import { Portal } from "solid-js/web";
import CheckIcon from "~icons/fe/check-circle";

const success = (message: string) => {
  return toaster.show((props) => (
    <Toast
      toastId={props.toastId}
      class="ui-opened:animate-slide-in w-full rounded border border-slate-500 bg-slate-600 text-sm text-white shadow-lg ui-closed:animate-content-hide"
    >
      <div class="flex items-center gap-4 p-2">
        <div class="relative flex size-8 items-center justify-center">
          <div class="absolute size-1/2 bg-white" />
          <CheckIcon class="absolute z-20 size-full *:fill-green-500" />
        </div>

        <div>
          <Toast.Title class="font-semibold">Success</Toast.Title>
          <Toast.Description class="font-extralight">
            {message}
          </Toast.Description>
        </div>
      </div>
      <Toast.ProgressTrack class="h-1 rounded bg-gray-500">
        <Toast.ProgressFill class="h-full w-[var(--kb-toast-progress-fill-width)] rounded bg-blue-500" />
      </Toast.ProgressTrack>
    </Toast>
  ));
};

export const ToastRegion = () => {
  return (
    <Portal>
      <Toast.Region duration={5000}>
        <Toast.List class="fixed top-0 flex w-full flex-col-reverse gap-4 p-4 sm:bottom-0 sm:right-0" />
      </Toast.Region>
    </Portal>
  );
};

export const toast = {
  success,
};
