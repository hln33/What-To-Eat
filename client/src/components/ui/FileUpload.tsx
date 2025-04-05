import { Component, Show } from "solid-js";
import {
  FileFieldItemDeleteTriggerProps,
  FileField as Kobalte,
} from "@kobalte/core/file-field";
import FileImageIcon from "~icons/lucide/file-image";
import CloseIcon from "~icons/fe/close";

import Button from "./Button";

/**
 * Currently only supports uploading a single image
 */
const FileUpload: Component<{
  label: string;
  description?: string;
}> = (props) => {
  return (
    <Kobalte
      onFileAccept={(data) => console.log(data)}
      class="flex w-full flex-col gap-2"
      onFileReject={(data) => console.error(data)}
    >
      <Kobalte.Label class="text-left text-xl">{props.label}</Kobalte.Label>

      <Kobalte.ItemList class="peer">
        {(_file) => (
          <Kobalte.Item class="relative size-fit">
            <Kobalte.ItemPreviewImage class="max-w-full" />
            <Kobalte.ItemDeleteTrigger
              as={(props: FileFieldItemDeleteTriggerProps) => (
                <Button
                  class="absolute right-2 top-2"
                  color="red"
                  {...props}
                >
                  <CloseIcon class="size-6" />
                </Button>
              )}
            />
          </Kobalte.Item>
        )}
      </Kobalte.ItemList>

      <Kobalte.Dropzone class="flex size-full h-60 flex-col items-center justify-center gap-4 rounded border-2 border-dashed border-slate-400 bg-slate-800 text-xl hover:border-slate-200 hover:bg-slate-600 peer-[:not(:empty)]:hidden">
        <FileImageIcon class="size-20" />
        <div class="whitespace-pre-wrap font-semibold">
          Drop image here, or{" "}
          <Kobalte.Trigger class="text-blue-400 hover:text-blue-600">
            browse
          </Kobalte.Trigger>
        </div>
      </Kobalte.Dropzone>
      <Kobalte.HiddenInput />

      <Show when={props.description}>
        <Kobalte.Description>{props.description}</Kobalte.Description>
      </Show>
    </Kobalte>
  );
};

export default FileUpload;
