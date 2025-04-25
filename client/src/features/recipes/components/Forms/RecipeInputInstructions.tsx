import { Component, For } from "solid-js";
import {
  Field,
  FieldArray,
  FormStore,
  insert,
  remove,
  required,
} from "@modular-forms/solid";

import InputError from "@/components/InputError";
import TextField from "@/components/ui/TextField";
import { RecipeForm } from "../../types";
import { AddFieldButton, DeleteFieldButton } from "./RecipeFormHelpers";

const RecipeInputInstructions: Component<{
  form: FormStore<RecipeForm>;
}> = (props) => {
  return (
    <FieldArray
      of={props.form}
      name="instructions"
      validate={[required("Please add Instructions")]}
    >
      {(fieldArray) => (
        <div class="flex flex-col">
          <div class="space-y-8">
            <For each={fieldArray.items}>
              {(_, index) => (
                <div class="my-2 flex items-center gap-3">
                  <Field
                    of={props.form}
                    name={`${fieldArray.name}.${index()}`}
                    validate={[required("Field cannot be empty")]}
                  >
                    {(field, fieldProps) => (
                      <TextField
                        {...fieldProps}
                        type="text"
                        label={`Instruction ${index() + 1}`}
                        required
                        value={field.value}
                        error={field.error}
                        disabled={props.form.submitting}
                      />
                    )}
                  </Field>
                  <DeleteFieldButton
                    class="self-end"
                    ariaLabel={`Delete instruction ${index()}`}
                    onClick={() =>
                      remove(props.form, fieldArray.name, { at: index() })
                    }
                    disabled={index() === 0}
                  />
                </div>
              )}
            </For>
          </div>
          <InputError errorMessage={fieldArray.error} />
          <AddFieldButton
            ariaLabel="Add instruction"
            onClick={() => insert(props.form, "instructions", { value: "" })}
            disabled={props.form.submitting}
          >
            Instruction
          </AddFieldButton>
        </div>
      )}
    </FieldArray>
  );
};

export default RecipeInputInstructions;
