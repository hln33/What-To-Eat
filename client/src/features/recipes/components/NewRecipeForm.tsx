import {
  Component,
  createSignal,
  ErrorBoundary,
  For,
  Suspense,
} from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { createForm, insert, remove, required } from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import InputError from "@/components/InputError";
import FileUpload from "@/components/ui/FileUpload";
import { RecipeForm, SubmittedRecipeForm } from "../types";
import { postRecipeImage } from "../api";
import { AddFieldButton, DeleteFieldButton } from "./RecipeFormHelpers";
import RecipeInputIngredients from "./RecipeInputIngredients";

const SectionHeader: Component<{ label: string }> = (props) => (
  <h2 class="mb-5 block text-left text-3xl">{props.label}</h2>
);

const NewRecipeForm: Component<{
  onSubmit: (recipe: SubmittedRecipeForm) => void;
}> = (props) => {
  const [form, { Form, Field, FieldArray }] = createForm<RecipeForm>({
    initialValues: {
      ingredients: [{ amount: 0, unit: undefined, name: "" }],
      instructions: [""],
    },
  });
  const [uploadedImageName, setUploadedImageName] = createSignal<string | null>(
    null,
  );

  /**
   * Upload image to a separate API endpoint for UX/DX purposes
   * https://stackoverflow.com/questions/33279153/rest-api-file-ie-images-processing-best-practices
   */
  const uploadImage = createMutation(() => ({
    mutationFn: postRecipeImage,
  }));
  const handleRecipeImageUpload = (file: File[]) => {
    if (file.length !== 1) {
      console.error("Only expected 1 file, but got:", file.length);
      return;
    }
    uploadImage.mutate(file[0], {
      onSuccess: (data) => setUploadedImageName(data.imageName),
    });
  };

  const handleSubmit = (values: SubmittedRecipeForm) => {
    props.onSubmit({
      ...values,
      uploadedImageName: uploadedImageName(),
    });
  };

  return (
    <ErrorBoundary fallback={<div>An error occurred...</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <Form
          class="flex flex-col items-center gap-12 p-8"
          onSubmit={(values) => handleSubmit(values as SubmittedRecipeForm)}
        >
          <FileUpload
            label="Recipe image (optional)"
            onFileAccept={handleRecipeImageUpload}
          />

          <div class="w-full space-y-10">
            <Field
              name="name"
              validate={[required("Please enter a name for the recipe")]}
            >
              {(field, props) => (
                <TextField
                  {...props}
                  type="text"
                  label="Recipe name"
                  value={field.value}
                  error={field.error}
                  disabled={form.submitting}
                />
              )}
            </Field>

            <SectionHeader label="Ingredients" />
            <RecipeInputIngredients form={form} />

            <FieldArray
              name="instructions"
              validate={[required("Please add Instructions")]}
            >
              {(fieldArray) => (
                <div class="flex flex-col">
                  <SectionHeader label="Instructions" />
                  <div class="space-y-8">
                    <For each={fieldArray.items}>
                      {(_, index) => (
                        <div class="my-2 flex items-center gap-3">
                          <Field
                            name={`${fieldArray.name}.${index()}`}
                            validate={[required("Field cannot be empty")]}
                          >
                            {(field, props) => (
                              <TextField
                                {...props}
                                type="text"
                                label={`Instruction ${index() + 1}`}
                                value={field.value}
                                error={field.error}
                                disabled={form.submitting}
                              />
                            )}
                          </Field>
                          <DeleteFieldButton
                            ariaLabel={`Delete instruction ${index()}`}
                            onClick={() =>
                              remove(form, fieldArray.name, { at: index() })
                            }
                            disabled={index() === 0}
                          />
                        </div>
                      )}
                    </For>
                  </div>
                  <InputError errorMessage={fieldArray.error} />
                  <AddFieldButton
                    onClick={() => insert(form, "instructions", { value: "" })}
                    disabled={form.submitting}
                  >
                    Add Instructions
                  </AddFieldButton>
                </div>
              )}
            </FieldArray>
          </div>

          <Button
            fullWidth
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Suspense>
    </ErrorBoundary>
  );
};

export default NewRecipeForm;
