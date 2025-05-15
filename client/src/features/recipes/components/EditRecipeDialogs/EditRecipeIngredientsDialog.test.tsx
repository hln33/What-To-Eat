import { describe, expect, test, vi } from "vitest";
import { screen, waitFor, within } from "@solidjs/testing-library";
import userEvent, { UserEvent } from "@testing-library/user-event";

import customRender from "@/testing/customRender";
import EditIngredientsDialog from "./EditRecipeIngredientsDialog";

describe("Edit Recipe Dialog", () => {
  /**
   * Manually remove listboxes because it does not get removed from the DOM for some reason.
   * This only occurs in the test environment, but not in the actual browser.
   */
  const removeListbox = (name: string) => {
    screen.getByRole("listbox", { name }).remove();
  };

  const testIngredientAmountInput = async (
    user: UserEvent,
    ingredient: HTMLElement,
    previousValue: number,
    newValue: number,
  ) => {
    const ingredientAmountInput = within(ingredient).getByRole("spinbutton", {
      name: "Amount",
    });
    expect(ingredientAmountInput).toHaveValue(previousValue);
    await user.clear(ingredientAmountInput);
    await user.type(ingredientAmountInput, newValue.toString());
    expect(ingredientAmountInput).toHaveValue(newValue);
  };

  const testIngredientUnitInput = async (
    user: UserEvent,
    ingredient: HTMLElement,
    previousValue: string,
    newValue: string,
  ) => {
    const ingredientUnitInput = within(ingredient).getByRole("button", {
      name: `Unit ${previousValue}`.trim(),
    });
    await user.click(ingredientUnitInput);
    await user.click(screen.getByRole("option", { name: newValue }));
    within(ingredient).getByRole("button", {
      name: `Unit ${newValue}`,
    });
    removeListbox("Unit");
  };

  const testIngredientNameInput = async (
    user: UserEvent,

    ingredient: HTMLElement,
    previousValue: string,
    newValue: string,
  ) => {
    expect(
      within(ingredient).getByRole("combobox", { name: "Name" }),
    ).toHaveValue(previousValue);
    await user.click(
      within(ingredient).getByRole("button", {
        name: "Name Show suggestions",
      }),
    );

    await user.click(await screen.findByRole("option", { name: newValue }));
    expect(
      within(ingredient).getByRole("combobox", { name: "Name" }),
    ).toHaveValue(newValue);
    removeListbox("Name Suggestions");
  };

  test("is able to send a request to edit a recipe", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    customRender(() => (
      <EditIngredientsDialog
        initialIngredients={[
          { amount: 100, unit: "g", name: "apples" },
          { amount: 75, unit: "lb", name: "eggs" },
        ]}
        onSubmit={handleSubmit}
      />
    ));
    const dialogTrigger = await screen.findByRole("button", {
      name: "Edit recipe ingredients",
    });

    await userEvent.click(dialogTrigger);

    const firstIngredient = screen.getByRole("group", { name: "Ingredient 1" });
    await testIngredientAmountInput(user, firstIngredient, 100, 50);
    await testIngredientUnitInput(user, firstIngredient, "g", "kg");
    await testIngredientNameInput(user, firstIngredient, "apples", "cheese");

    const secondIngredient = screen.getByRole("group", {
      name: "Ingredient 2",
    });
    await testIngredientAmountInput(user, secondIngredient, 75, 25);
    await testIngredientUnitInput(user, secondIngredient, "lb", "oz");
    await testIngredientNameInput(user, secondIngredient, "eggs", "salt");

    await user.click(screen.getByRole("button", { name: "Add ingredient" }));

    const thirdIngredient = screen.getByRole("group", {
      name: "Ingredient 3",
    });
    await testIngredientAmountInput(user, thirdIngredient, 0, 10);
    await testIngredientUnitInput(user, thirdIngredient, "g", "lb");
    await testIngredientNameInput(user, thirdIngredient, "", "apples");

    await user.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        ingredients: [
          { amount: 50, unit: "kg", name: "cheese" },
          { amount: 25, unit: "oz", name: "salt" },
          { amount: 10, unit: "lb", name: "apples" },
        ],
      }),
    );
  });
});
