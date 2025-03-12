import { For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  createForm,
  custom,
  insert,
  remove,
  required,
  SubmitHandler,
} from "@modular-forms/solid";
import TrashIcon from "~icons/fe/trash";
import PlusIcon from "~icons/fe/plus";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import InputError from "@/components/InputError";
import Combobox from "@/components/ui/Combobox";
import RequiredInputLabel from "@/components/RequiredInputLabel";
import { postNewRecipe } from "../api";

type RecipeForm = {
  name: string;
  ingredients: string[];
  instructions: string[];
};

const NewRecipeForm = () => {
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>({
    initialValues: {
      instructions: [""],
    },
  });
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<RecipeForm> = async (values) => {
    const recipe = await postNewRecipe(values);
    if (recipe) {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  return (
    <Form
      class="w-80 space-y-10 p-4"
      onSubmit={handleSubmit}
    >
      <div class="space-y-8">
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

        <Field
          name="ingredients"
          type="string[]"
          validate={[
            custom((values: string[] | undefined) => {
              return (
                values !== undefined && values.length !== 0 && values[0] !== ""
              );
            }, "Please enter ingredients."),
          ]}
        >
          {(field, props) => (
            <Combobox
              controlled={false}
              {...props}
              label="Ingredients"
              placeholder="Search Ingredients"
              options={["eggs", "cheese", "salt", "pepper"]}
              value={field.value}
              error={field.error}
              required
            />
          )}
        </Field>

        <FieldArray
          name="instructions"
          validate={[required("Please add Instructions.")]}
        >
          {(fieldArray) => (
            <div>
              <label
                class="block text-left"
                for={fieldArray.name}
              >
                <RequiredInputLabel label="Instructions" />
              </label>
              <For each={fieldArray.items}>
                {(_, index) => (
                  <div class="mb-2 mt-1 flex gap-4">
                    <Field
                      name={`${fieldArray.name}.${index()}`}
                      validate={[required("Field cannot be empty.")]}
                    >
                      {(field, props) => (
                        <TextField
                          {...props}
                          class="w-full"
                          type="text"
                          value={field.value}
                          error={field.error}
                          required
                          disabled={form.submitting}
                        />
                      )}
                    </Field>
                    <Show when={index() !== 0}>
                      <Button
                        onClick={() =>
                          remove(form, fieldArray.name, { at: index() })
                        }
                      >
                        <TrashIcon />
                      </Button>
                    </Show>
                  </div>
                )}
              </For>
              <InputError errorMessage={fieldArray.error} />
            </div>
          )}
        </FieldArray>
        <Button
          fullWidth
          onClick={() => insert(form, "instructions", { value: "" })}
          disabled={form.submitting}
        >
          <span class="inline-flex items-center gap-2">
            <PlusIcon class="inline" /> Instructions
          </span>
        </Button>
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
