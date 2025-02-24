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
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: [""],
      steps: [""],
    },
  });

  const handleSubmit: SubmitHandler<RecipeForm> = () => {
    console.log("submitting");
  };

  return (
    <div class="space-y-10">
      <h2 class="text-3xl">New Recipe</h2>

      <Form
        class="space-y-8"
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
            <div class="space-y-2">
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
                        <div class="mb-2 mt-1 flex">
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
                            class="size-12"
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
                class="block w-fit px-4 capitalize"
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
    </div>
  );
};

export default NewRecipeForm;
