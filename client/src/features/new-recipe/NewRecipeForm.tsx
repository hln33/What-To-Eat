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
import { postNewRecipe } from "../../api";
import { useNavigate } from "@solidjs/router";

type RecipeForm = {
  name: string;
  ingredients: string[];
  instructions: string[];
};

const NewRecipeForm = () => {
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: [""],
      instructions: [""],
    },
  });
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<RecipeForm> = async (values) => {
    const recipe = await postNewRecipe(values);
    console.log(recipe);
    if (recipe) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <Form
      class="w-80 space-y-8 p-4"
      onSubmit={handleSubmit}
    >
      <Field
        name="name"
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

      <For each={["ingredients", "instructions"] as const}>
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
                          class="size-12 bg-slate-500"
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
              class="block w-fit bg-slate-500 px-4 capitalize"
              onClick={() => insert(form, fieldName, { value: "" })}
              disabled={form.submitting}
            >
              + {fieldName}
            </Button>
          </div>
        )}
      </For>

      <Button
        class="w-full bg-slate-500"
        type="submit"
      >
        Submit
      </Button>
    </Form>
  );
};

export default NewRecipeForm;
