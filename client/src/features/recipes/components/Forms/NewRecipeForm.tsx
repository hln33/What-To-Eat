import { Component, createSignal, ErrorBoundary, Suspense } from "solid-js";
import { createForm, minRange, required, setValue } from "@modular-forms/solid";

import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";
import { RecipeForm, SubmittedRecipeForm } from "../../types";
import { createUploadImageMutation } from "../../mutations";
import RecipeInputIngredients from "./RecipeInputIngredients";
import RecipeInputInstructions from "./RecipeInputInstructions";
import RecipeInputName from "./RecipeInputName";
import NumberField from "@/components/ui/NumberField";

const SectionHeader: Component<{ label: string }> = (props) => (
  <h2 class="mb-5 block text-left text-3xl">{props.label}</h2>
);

const NewRecipeForm: Component<{
  onSubmit: (recipe: SubmittedRecipeForm) => void;
}> = (props) => {
  const [form, { Field, Form }] = createForm<RecipeForm>({
    initialValues: {
      servings: 0,
      ingredients: [{ amount: 0, unit: undefined, name: "" }],
      instructions: [""],
    },
  });
  const [uploadedImageName, setUploadedImageName] = createSignal<string | null>(
    null,
  );

  const uploadImageMutation = createUploadImageMutation();
  const handleRecipeImageUpload = (file: File[]) => {
    if (file.length !== 1) {
      console.error("Only expected 1 file, but got:", file.length);
      return;
    }
    uploadImageMutation.mutate(file[0], {
      onSuccess: (data) => setUploadedImageName(data.imageName),
    });
  };

  const handleSubmit = (values: SubmittedRecipeForm) => {
    console.log(values);
    props.onSubmit({
      ...values,
      uploadedImageName: uploadedImageName(),
    });
  };

  return (
    <ErrorBoundary fallback={<div>An error occurred...</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <Form
          class="flex flex-col items-center gap-12"
          onSubmit={(values) => handleSubmit(values as SubmittedRecipeForm)}
        >
          <div class="w-full space-y-20">
            <div class="space-y-6">
              <SectionHeader label="General" />
              <FileUpload
                label="Recipe image (optional)"
                onFileAccept={handleRecipeImageUpload}
              />
              <RecipeInputName form={form} />
              <Field
                name="servings"
                type="number"
                validate={[
                  required("Please enter number of servings."),
                  minRange(
                    1,
                    "Please enter a serving amount greater than zero",
                  ),
                ]}
              >
                {(field, _fieldProps) => (
                  <NumberField
                    label="servings"
                    required
                    value={field.value}
                    handleRawInputChange={(value) =>
                      setValue(form, "servings", value)
                    }
                    error={field.error}
                  />
                )}
              </Field>
            </div>

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
