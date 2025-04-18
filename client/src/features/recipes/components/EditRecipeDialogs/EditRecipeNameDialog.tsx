import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { RecipeForm, SubmittedRecipeForm } from "../../types";
import RecipeInputName from "../Forms/RecipeInputName";
import { EditRecipeDialogActions } from "./EditRecipeDialogActions";

type EditRecipeNameFormValues = Pick<SubmittedRecipeForm, "name">;

const EditRecipeNameDialog: Component<{
  initialName: string;
  onSubmit: (values: EditRecipeNameFormValues) => void;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [form, { Form }] = createForm<RecipeForm>({
    initialValues: {
      name: props.initialName,
    },
  });

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

      <DialogContent title="Ingredients">
        <ErrorBoundary fallback={<div>An error occurred</div>}>
          <Suspense fallback={<div>...</div>}>
            <Form
              onSubmit={(values) => {
                props.onSubmit(values as EditRecipeNameFormValues);
                setOpen(false);
              }}
            >
              <RecipeInputName form={form} />
              <EditRecipeDialogActions onClose={() => setOpen(false)} />
            </Form>
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeNameDialog;
