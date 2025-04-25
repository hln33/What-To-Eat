import { Component } from "solid-js";
import { Field, FormStore, required } from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import { RecipeForm } from "../../types";

const RecipeInputName: Component<{ form: FormStore<RecipeForm> }> = (props) => {
  return (
    <Field
      of={props.form}
      name="name"
      validate={[required("Please enter a name for the recipe")]}
    >
      {(field, fieldProps) => (
        <TextField
          {...fieldProps}
          type="text"
          label="Recipe name"
          required
          value={field.value}
          error={field.error}
          disabled={props.form.submitting}
        />
      )}
    </Field>
  );
};

export default RecipeInputName;
