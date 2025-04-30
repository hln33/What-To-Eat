import { describe, expect, test } from "vitest";
import { screen, within } from "@solidjs/testing-library";
import userEvent, { UserEvent } from "@testing-library/user-event";

import customRender from "@/testing/customRender";
import { createForm } from "@modular-forms/solid";
import { RecipeForm } from "../../types";
import RecipeInputIngredients from "./RecipeInputIngredients";

const getIngredientInputs = (fieldset: HTMLElement) => {
  return {
    amount: within(fieldset).getByRole("spinbutton", { name: "Amount" }),
    unit: within(fieldset).getByRole("button", { name: /Unit/ }),
    nameTrigger: within(fieldset).getByRole("button", {
      name: "Name Show suggestions",
    }),
    nameInput: within(fieldset).getByRole("combobox", { name: "Name" }),
  };
};

/**
 * Manually remove listboxes because it does not get removed from the DOM for some reason.
 * This only occurs in the test environment, but not in the actual browser.
 */
const removeListbox = (name: string) => {
  screen.getByRole("listbox", { name }).remove();
};

const testIngredientNameOptions = async (
  ingredientFieldSetName: string,
  excludedOptions: string[],
  user: UserEvent,
) => {
  const ingredientInputs = getIngredientInputs(
    await screen.findByRole("group", { name: ingredientFieldSetName }),
  );

  await user.click(ingredientInputs.nameTrigger);

  const ingredientNameSuggestions = screen.getByRole("listbox", {
    name: "Name Suggestions",
  });
  for (const option of excludedOptions) {
    expect(
      within(ingredientNameSuggestions).queryByRole("option", {
        name: option,
      }),
    ).toBeNull();
  }
  removeListbox("Name Suggestions");
};

describe("New Recipe Form", () => {
  test.only("does not provide already selected ingredients as options", async () => {
    const user = userEvent.setup();
    const [form] = createForm<RecipeForm>({
      initialValues: {
        servings: 0,
        ingredients: [
          { amount: 5, unit: "g", name: "apples" },
          { amount: 10, unit: "g", name: "cheese" },
          { amount: 15, unit: "g", name: "salt" },
        ],
        instructions: [""],
      },
    });
    customRender(() => <RecipeInputIngredients form={form} />);

    await testIngredientNameOptions("Ingredient 1", ["cheese", "salt"], user);
    await testIngredientNameOptions("Ingredient 2", ["apples", "salt"], user);
    await testIngredientNameOptions("Ingredient 3", ["apples", "cheese"], user);
  });
});
