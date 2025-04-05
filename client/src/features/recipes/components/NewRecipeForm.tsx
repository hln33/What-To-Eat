import { Component, For, ParentComponent } from "solid-js";
import {
  createForm,
  insert,
  minRange,
  remove,
  required,
} from "@modular-forms/solid";
import TrashIcon from "~icons/fe/trash";
import PlusIcon from "~icons/fe/plus";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import InputError from "@/components/InputError";
import Select from "@/components/ui/Select";
import Combobox from "@/components/ui/Combobox";
import FileUpload from "@/components/ui/FileUpload";
import { RecipeForm, SubmittedRecipeForm } from "../types";

const SectionHeader: Component<{ for: string; label: string }> = (props) => (
  <h2 class="mb-5 block text-left text-3xl">{props.label}</h2>
);

const DeleteFieldButton: Component<{
  ariaLabel: string;
  onClick: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <Button
      class="self-end"
      variant="subtle"
      color="red"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <TrashIcon class="size-6" />
    </Button>
  );
};

const AddFieldButton: ParentComponent<{
  onClick: () => void;
  disabled: boolean;
}> = (props) => {
  return (
    <Button
      class="mt-3"
      variant="outline"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span class="inline-flex items-center gap-2">
        <PlusIcon class="inline" />
        {props.children}
      </span>
    </Button>
  );
};

const NewRecipeForm: Component<{
  onSubmit: (recipe: SubmittedRecipeForm) => void;
}> = (props) => {
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: [{ amount: 0, unit: undefined, name: "" }],
      instructions: [""],
    },
  });

  return (
    <Form
      class="flex flex-col items-center gap-12 p-8"
      onSubmit={(values) => props.onSubmit(values as SubmittedRecipeForm)}
    >
      <FileUpload label="Recipe image (optional)" />

      <div class="w-full space-y-10">
        <Field
          name="name"
          validate={[required("Please enter a name for the recipe")]}
        >
          {(field, props) => (
            <TextField
              {...props}
              type="text"
              label="Recipe Name"
              value={field.value}
              error={field.error}
              disabled={form.submitting}
            />
          )}
        </Field>

        <FieldArray
          name="ingredients"
          validate={[required("Please add Ingredients")]}
        >
          {(fieldArray) => (
            <div class="flex flex-col">
              <SectionHeader
                for={fieldArray.name}
                label="Ingredients"
              />
              <div class="space-y-8">
                <For each={fieldArray.items}>
                  {(_, index) => (
                    <fieldset class="rounded bg-slate-600 p-4 shadow-lg">
                      <legend class="rounded border border-slate-400 bg-slate-950 p-2 text-left text-xl">
                        Ingredient {index() + 1}
                      </legend>
                      <div class="my-2 flex items-start gap-3">
                        <Field
                          name={`${fieldArray.name}.${index()}.amount`}
                          type="number"
                          validate={[
                            required("Please enter an amount"),
                            minRange(
                              1,
                              "Please enter an amount greater than zero",
                            ),
                          ]}
                        >
                          {(field, props) => (
                            <TextField
                              {...props}
                              class="w-3/12"
                              label="Amount"
                              type="number"
                              value={field.value?.toString()}
                              error={field.error}
                            />
                          )}
                        </Field>
                        <Field
                          name={`${fieldArray.name}.${index()}.unit`}
                          validate={[required("Please enter a unit")]}
                        >
                          {(field, props) => (
                            <Select
                              {...props}
                              class="w-3/12"
                              label="Unit"
                              options={["g", "kg", "oz", "lb"]}
                              defaultValue={field.value ?? ""}
                              value={field.value}
                              error={field.error}
                              required
                            />
                          )}
                        </Field>
                        <Field
                          name={`${fieldArray.name}.${index()}.name`}
                          validate={[required("Please enter an ingredient")]}
                        >
                          {(field, props) => (
                            <Combobox
                              {...props}
                              class="w-4/12"
                              controlled={false}
                              label="Name"
                              value={field.value}
                              error={field.error}
                              options={["apples", "eggs", "salt", "cheese"]}
                            />
                          )}
                        </Field>
                        <DeleteFieldButton
                          ariaLabel={`Delete ingredient ${index() + 1}`}
                          onClick={() =>
                            remove(form, fieldArray.name, { at: index() })
                          }
                          disabled={index() === 0}
                        />
                      </div>
                    </fieldset>
                  )}
                </For>
              </div>
              <InputError errorMessage={fieldArray.error} />
              <AddFieldButton
                onClick={() =>
                  insert(form, "ingredients", {
                    value: { amount: 0, unit: undefined, name: "" },
                  })
                }
                disabled={form.submitting}
              >
                Add Ingredient
              </AddFieldButton>
            </div>
          )}
        </FieldArray>

        <FieldArray
          name="instructions"
          validate={[required("Please add Instructions")]}
        >
          {(fieldArray) => (
            <div class="flex flex-col">
              <SectionHeader
                for={fieldArray.name}
                label="Instructions"
              />
              <div class="space-y-8">
                <For each={fieldArray.items}>
                  {(_, index) => (
                    <div class="my-2 flex items-center gap-3">
                      <Field
                        name={`${fieldArray.name}.${index()}`}
                        validate={[required("Field cannot be empty")]}
                      >
                        {(field, props) => (
                          <TextField
                            {...props}
                            type="text"
                            label={`Instruction ${index() + 1}`}
                            value={field.value}
                            error={field.error}
                            disabled={form.submitting}
                          />
                        )}
                      </Field>
                      <DeleteFieldButton
                        ariaLabel={`Delete instruction ${index()}`}
                        onClick={() =>
                          remove(form, fieldArray.name, { at: index() })
                        }
                        disabled={index() === 0}
                      />
                    </div>
                  )}
                </For>
              </div>
              <InputError errorMessage={fieldArray.error} />
              <AddFieldButton
                onClick={() => insert(form, "instructions", { value: "" })}
                disabled={form.submitting}
              >
                Add Instructions
              </AddFieldButton>
            </div>
          )}
        </FieldArray>
      </div>

      <Button
        fullWidth
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export default NewRecipeForm;
