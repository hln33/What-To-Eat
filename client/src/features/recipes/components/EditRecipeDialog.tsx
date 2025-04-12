import { Component, createSignal } from "solid-js";
import { createForm } from "@modular-forms/solid";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import PencilIcon from "~icons/lucide/pencil";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { Ingredient, RecipeForm } from "../types";
import RecipeInputIngredients from "./RecipeInputIngredients";

export type EditIngredientsFormValues = Pick<RecipeForm, "ingredients">;

const EditIngredientsDialog: Component<{
  initialIngredients: Ingredient[];
  onSubmit: (values: EditIngredientsFormValues) => void;
}> = (props) => {
  const [open, setOpen] = createSignal(false);
  const [form, { Form }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: props.initialIngredients,
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
            <PencilIcon aria-label="Edit recipe" />
          </Button>
        )}
      />

      <DialogContent title="Ingredients">
        <Form onSubmit={(values) => props.onSubmit(values)}>
          <RecipeInputIngredients form={form} />
          <div class="mt-8 flex justify-end gap-4">
            <Button
              variant="subtle"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              variant="filled"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditIngredientsDialog;
