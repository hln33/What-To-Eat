import { For } from "solid-js";
import {
  createForm,
  insert,
  remove,
  required,
  SubmitHandler,
} from "@modular-forms/solid";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import InputError from "../../components/InputError";
import RequiredInputAsterisk from "../../components/RequiredInputAsterisk";
import { api } from "../../api";

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

  const handleSubmit: SubmitHandler<RecipeForm> = async (values) => {
    const res = await api.recipes.$post({ form: values });
    console.log(await res.json());
  };

  return (
    <section class="space-y-10">
      <h2 class="text-3xl">New Recipe</h2>

      <Form
        class="space-y-8"
        onSubmit={handleSubmit}
      >
        <Field
          name="recipeName"
          validate={[required("Please enter a name for the recipe.")]}
        >
          {(field, props) => (
            <TextField
              {...props}
              type="text"
              label="Recipe Name"
              value={field.value}
              error={field.error}
              required
              disabled={form.submitting}
            />
          )}
        </Field>

        <For each={["ingredients", "steps"] as const}>
          {(fieldName, _) => (
            <div>
              <FieldArray
                name={fieldName}
                validate={[required(`Please add ${fieldName}.`)]}
              >
                {(fieldArray) => (
                  <>
                    <label
                      class="block text-left capitalize"
                      for={fieldArray.name}
                    >
                      {fieldName} <RequiredInputAsterisk />
                    </label>
                    <For each={fieldArray.items}>
                      {(_, index) => (
                        <div class="mb-2 mt-1 flex">
                          <Field
                            name={`${fieldArray.name}.${index()}`}
                            validate={[required("Field cannot be empty.")]}
                          >
                            {(field, props) => (
                              <TextField
                                {...props}
                                type="text"
                                value={field.value}
                                error={field.error}
                                required
                                disabled={form.submitting}
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
                    <InputError errorMessage={fieldArray.error} />
                  </>
                )}
              </FieldArray>
              <Button
                class="block w-fit px-4 capitalize"
                onClick={() => insert(form, fieldName, { value: "" })}
                disabled={form.submitting}
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
    </section>
  );
};

export default NewRecipeForm;
