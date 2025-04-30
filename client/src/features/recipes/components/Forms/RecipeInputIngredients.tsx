import { Component, For } from "solid-js";
import {
  Field,
  FieldArray,
  FormStore,
  getValues,
  insert,
  minRange,
  remove,
  required,
  setValue,
} from "@modular-forms/solid";

import { createIngredientNamesQuery } from "@/features/ingredients/queries";
import InputError from "@/components/InputError";
import Combobox from "@/components/ui/Combobox";
import Select from "@/components/ui/Select";
import TextField from "@/components/ui/TextField";
import { RecipeForm } from "../../types";
import { AddFieldButton, DeleteFieldButton } from "./RecipeFormHelpers";

const RecipeInputIngredients: Component<{
  form: FormStore<RecipeForm>;
}> = (props) => {
  const ingredientNamesQuery = createIngredientNamesQuery();

  const selectedIngredientNames = (): (string | undefined)[] =>
    getValues(props.form, "ingredients").map((ingredient) => ingredient?.name);

  const getAvailableIngredientNames = (ingredientIndex: number) => {
    if (ingredientNamesQuery.data === undefined) {
      return [];
    }
    return ingredientNamesQuery.data.filter(
      (ingredient) =>
        !selectedIngredientNames()
          .toSpliced(ingredientIndex, 1)
          .includes(ingredient),
    );
  };

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
                <fieldset class="relative flex flex-col rounded border border-slate-500 px-4 py-1 shadow-lg">
                  <legend class="rounded px-2 text-left text-xl font-bold">
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
                          required
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
                          required
                          value={field.value}
                          error={field.error}
                        />
                      )}
                    </Field>
                    <Field
                      of={props.form}
                      name={`${fieldArray.name}.${index()}.name`}
                      validate={[required("Please enter an ingredient")]}
                    >
                      {(field, _fieldProps) => (
                        <Combobox
                          class="w-6/12"
                          required
                          label="Name"
                          options={getAvailableIngredientNames(index())}
                          value={field.value}
                          onChange={(value) =>
                            setValue(
                              props.form,
                              `${fieldArray.name}.${index()}.name`,
                              value ?? "",
                            )
                          }
                          error={field.error}
                        />
                      )}
                    </Field>
                  </div>
                  <DeleteFieldButton
                    class="-ml-3"
                    ariaLabel={`Delete ingredient ${index() + 1}`}
                    buttonText="Delete ingredient"
                    onClick={() =>
                      remove(props.form, fieldArray.name, { at: index() })
                    }
                    disabled={index() === 0}
                  />
                </fieldset>
              )}
            </For>
          </div>
          <InputError errorMessage={fieldArray.error} />
          <AddFieldButton
            ariaLabel="Add ingredient"
            onClick={() =>
              insert(props.form, "ingredients", {
                value: { amount: 0, unit: undefined, name: "" },
              })
            }
            disabled={props.form.submitting}
          >
            Ingredient
          </AddFieldButton>
        </div>
      )}
    </FieldArray>
  );
};

export default RecipeInputIngredients;
