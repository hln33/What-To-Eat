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

  const addIngredient = () => {
    insert(form, "ingredients", { value: "eggs" });
  };
  const removeIngredient = (index: number) => {
    remove(form, "ingredients", { at: index });
  };

  const addStep = () => {
    insert(form, "steps", { value: "1000" });
  };
  const removeStep = (index: number) => {
    remove(form, "steps", { at: index });
  };

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

      <div>
        <FieldArray name="ingredients">
          {(fieldArray) => (
            <div>
              <label
                class="block text-left"
                for={fieldArray.name}
              >
                Ingredients *
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
                    <Button onClick={() => removeIngredient(index())}>X</Button>
                  </div>
                )}
              </For>
            </div>
          )}
        </FieldArray>
        <Button
          class="mt-2 block w-fit"
          onClick={addIngredient}
        >
          + Ingredients
        </Button>
      </div>

      <div>
        <FieldArray name="steps">
          {(fieldArray) => (
            <div>
              <label
                class="block text-left"
                for={fieldArray.name}
              >
                Steps *
              </label>
              <For each={fieldArray.items}>
                {(_, index) => (
                  <div class="my-4 flex">
                    <Field name={`steps.${index()}`}>
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
                    <Button onClick={() => removeStep(index())}>X</Button>
                  </div>
                )}
              </For>
            </div>
          )}
        </FieldArray>
        <Button
          class="mt-2 block w-fit"
          onClick={addStep}
        >
          + Step
        </Button>
      </div>

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
