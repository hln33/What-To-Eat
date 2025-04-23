import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { EditRecipeDialogActions } from "./EditRecipeDialogActions";
import { createUploadImageMutation } from "../../mutations";

const EditRecipeImageDialog: Component<{
  onImageSave: (uploadedImageName: string) => void;
}> = (props) => {
  const [, { Form }] = createForm();
  const [open, setOpen] = createSignal(false);
  const [uploadedImageName, setUploadedImageName] = createSignal<string | null>(
    null,
  );

  const handleSubmit = () => {
    if (uploadedImageName() === null) {
      console.error("cannot submit form with no image uploaded");
      return;
    }
    props.onImageSave(uploadedImageName()!);
  };

  const uploadImageMutation = createUploadImageMutation();
  const handleFileAccept = (files: File[]) => {
    if (files.length > 1) {
      console.error("only expected one file.");
      return;
    }
    uploadImageMutation.mutate(files[0], {
      onSuccess: (data) => setUploadedImageName(data.imageName),
    });
  };

  return (
    <Dialog
      open={open()}
      setOpen={setOpen}
    >
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button
            {...props}
            variant="subtle"
          >
            <PencilIcon
              class="text-slate-300"
              aria-label="Edit recipe ingredients"
            />
          </Button>
        )}
      />

      <DialogContent title="Recipe Image">
        <ErrorBoundary fallback={<div>An error occurred</div>}>
          <Suspense fallback={<div>...</div>}>
            <Form
              onSubmit={() => {
                handleSubmit();
                setOpen(false);
              }}
            >
              <FileUpload
                label="Image upload"
                onFileAccept={handleFileAccept}
              />
              <EditRecipeDialogActions onClose={() => setOpen(false)} />
            </Form>
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeImageDialog;
