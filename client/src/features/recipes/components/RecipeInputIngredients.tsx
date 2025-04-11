import { Component, For } from "solid-js";
import {
  Field,
  FieldArray,
  FormStore,
  insert,
  minRange,
  remove,
  required,
} from "@modular-forms/solid";

import InputError from "@/components/InputError";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import { RecipeForm } from "../types";
import { AddFieldButton, DeleteFieldButton } from "./FormHelpers";

const RecipeInputIngredients: Component<{
  form: FormStore<RecipeForm>;
}> = (props) => {
  return (
    <FieldArray
      of={props.form}
      name="ingredients"
      validate={[required("Please add Ingredients")]}
    >
      {(fieldArray) => (
        <div class="flex flex-col">
          <div class="space-y-8">
            <For each={fieldArray.items}>
              {(_, index) => (
                <fieldset class="rounded bg-slate-600 p-4 shadow-lg">
                  <legend class="rounded border border-slate-400 bg-slate-950 p-2 text-left text-xl">
                    Ingredient {index() + 1}
                  </legend>
                  <div class="my-2 flex items-start gap-3">
                    <Field
                      of={props.form}
                      name={`${fieldArray.name}.${index()}.amount`}
                      type="number"
                      validate={[
                        required("Please enter an amount"),
                        minRange(1, "Please enter an amount greater than zero"),
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
                      of={props.form}
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
                      of={props.form}
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
                        remove(props.form, fieldArray.name, { at: index() })
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
              insert(props.form, "ingredients", {
                value: { amount: 0, unit: undefined, name: "" },
              })
            }
            disabled={props.form.submitting}
          >
            Add Ingredient
          </AddFieldButton>
        </div>
      )}
    </FieldArray>
  );
};

export default RecipeInputIngredients;
