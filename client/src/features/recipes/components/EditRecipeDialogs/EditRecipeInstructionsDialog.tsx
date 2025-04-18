import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { RecipeForm, SubmittedRecipeForm } from "../../types";
import RecipeInputInstructions from "../Forms/RecipeInputInstructions";
import { EditRecipeDialogActions } from "./EditRecipeDialogActions";

type EditInstructionsFormValues = Pick<SubmittedRecipeForm, "instructions">;

const EditInstructionsDialog: Component<{
  initialInstructions: string[];
  onSubmit: (values: EditInstructionsFormValues) => void;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [form, { Form }] = createForm<RecipeForm>({
    initialValues: {
      instructions: props.initialInstructions,
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
              aria-label="Edit recipe instructions"
            />
          </Button>
        )}
      />

      <DialogContent title="Instructions">
        <ErrorBoundary fallback={<div>An error occurred</div>}>
          <Suspense fallback={<div>...</div>}>
            <Form
              onSubmit={(values) => {
                props.onSubmit(values as EditInstructionsFormValues);
                setOpen(false);
              }}
            >
              <RecipeInputInstructions form={form} />
              <EditRecipeDialogActions onClose={() => setOpen(false)} />
            </Form>
          </Suspense>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default EditInstructionsDialog;
