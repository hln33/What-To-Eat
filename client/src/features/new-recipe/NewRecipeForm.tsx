import { For } from "solid-js";
import {
  createForm,
  insert,
  remove,
  SubmitHandler,
} from "@modular-forms/solid";
import TextField from "../../components/TextField";
import Button from "../../components/Button";

type RecipeForm = {
  recipeName: string;
  ingredients: string[];
  steps: string[];
};

const NewRecipeForm = () => {
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>();

  const handleSubmit: SubmitHandler<RecipeForm> = () => {
    console.log("submitting");
  };

  return (
    <Form
      class="flex flex-col items-start gap-8"
      onSubmit={handleSubmit}
    >
      <Field name="recipeName">
        {(field, props) => (
          <TextField
            {...props}
            type="text"
            label="Recipe Name"
            value={field.value}
            error={field.error}
            required
          />
        )}
      </Field>

      <For each={["ingredients", "steps"] as const}>
        {(fieldName, _) => (
          <div>
            <FieldArray name={fieldName}>
              {(fieldArray) => (
                <>
                  <label
                    class="block text-left capitalize"
                    for={fieldArray.name}
                  >
                    {fieldName} *
                  </label>
                  <For each={fieldArray.items}>
                    {(_, index) => (
                      <div class="my-4 flex">
                        <Field name={`ingredients.${index()}`}>
                          {(field, props) => (
                            <TextField
                              {...props}
                              type="text"
                              value={field.value}
                              error={field.error}
                              required
                            />
                          )}
                        </Field>
                        <Button
                          onClick={() =>
                            remove(form, fieldArray.name, { at: index() })
                          }
                        >
                          X
                        </Button>
                      </div>
                    )}
                  </For>
                </>
              )}
            </FieldArray>
            <Button
              class="mt-2 block w-fit capitalize"
              onClick={() => insert(form, fieldName, { value: "" })}
            >
              + {fieldName}
            </Button>
          </div>
        )}
      </For>

      <Button
        class="w-full"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export default NewRecipeForm;
