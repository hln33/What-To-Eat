import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { RecipeForm, SubmittedRecipeForm } from "../../types";
import { createUploadImageMutation } from "../../mutations";
import RecipeInputName from "../Forms/RecipeInputName";
import { EditRecipeDialogActions } from "./EditRecipeDialogActions";

type EditRecipeImageAndNameFormValues = Pick<
  SubmittedRecipeForm,
  "name" | "uploadedImageName"
>;

const EditRecipeImageAndNameDialog: Component<{
  initialName: string;
  onSubmit: (values: EditRecipeImageAndNameFormValues) => void;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [uploadedImageName, setUploadedImageName] = createSignal<string | null>(
    null,
  );
  const [form, { Form }] = createForm<RecipeForm>({
    initialValues: {
      name: props.initialName,
    },
  });

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
            variant="filled"
          >
            <PencilIcon
              class="text-slate-200"
              aria-label="Edit recipe image"
            />
          </Button>
        )}
      />

      <DialogContent title="Recipe Image">
        <ErrorBoundary fallback={<div>An error occurred</div>}>
          <Suspense fallback={<div>...</div>}>
            <Form
              onSubmit={({ name }) => {
                if (uploadedImageName() === null) {
                  console.warn("form submitted with no image");
                }
                props.onSubmit({
                  name,
                  uploadedImageName: uploadedImageName(),
                });

                setOpen(false);
              }}
            >
              <div class="space-y-8">
                <FileUpload
                  label="Image upload"
                  onFileAccept={handleFileAccept}
                />
                <RecipeInputName form={form} />
                <EditRecipeDialogActions onClose={() => setOpen(false)} />
              </div>
            </Form>
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeImageAndNameDialog;
