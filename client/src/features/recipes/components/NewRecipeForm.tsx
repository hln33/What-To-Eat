import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { createForm, required } from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { RecipeForm, SubmittedRecipeForm } from "../types";
import { postRecipeImage } from "../api";
import RecipeInputIngredients from "./RecipeInputIngredients";
import RecipeInputInstructions from "./RecipeInputInstructions";

const SectionHeader: Component<{ label: string }> = (props) => (
  <h2 class="mb-5 block text-left text-3xl">{props.label}</h2>
);

const NewRecipeForm: Component<{
  onSubmit: (recipe: SubmittedRecipeForm) => void;
}> = (props) => {
  const [form, { Form, Field }] = createForm<RecipeForm>({
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

          <div class="w-full space-y-20">
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

            <div>
              <SectionHeader label="Ingredients" />
              <RecipeInputIngredients form={form} />
            </div>

            <div>
              <SectionHeader label="Instructions" />
              <RecipeInputInstructions form={form} />
            </div>
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
