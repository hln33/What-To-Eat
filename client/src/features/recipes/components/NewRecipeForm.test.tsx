import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import ProviderWrapper from "@/testing/ProviderWrapper";
import NewRecipeForm from "./NewRecipeForm";

describe("New Recipe Form", () => {
  const getIngredientInputs = (fieldset: HTMLElement) => {
    return {
      amount: within(fieldset).getByRole("spinbutton", { name: "Amount" }),
      unit: within(fieldset).getByRole("button", { name: "Unit" }),
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

  test("Can submit a new recipe", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(() => <NewRecipeForm onSubmit={handleSubmit} />, {
      wrapper: ProviderWrapper,
    });

    await user.type(
      screen.getByRole("textbox", {
        name: "Recipe name",
      }),
      "Scrambled Eggs",
    );

    const firstIngredientInputs = getIngredientInputs(
      screen.getByRole("group", { name: "Ingredient 1" }),
    );
    await user.type(firstIngredientInputs.amount, "1");

    await user.click(firstIngredientInputs.unit);
    await user.click(screen.getByRole("option", { name: "kg" }));
    removeListbox("Unit");

    await user.click(firstIngredientInputs.nameTrigger);
    await user.click(screen.getByRole("option", { name: "eggs" }));
    removeListbox("Name Suggestions");

    await user.click(screen.getByRole("button", { name: "Add Ingredient" }));

    const secondIngredientInputs = getIngredientInputs(
      screen.getByRole("group", { name: "Ingredient 2" }),
    );
    await user.type(secondIngredientInputs.amount, "200");
    await user.click(secondIngredientInputs.unit);
    await user.click(screen.getByRole("option", { name: "g" }));
    await user.click(secondIngredientInputs.nameTrigger);
    await user.click(screen.getByRole("option", { name: "cheese" }));

    const addInstructionButton = screen.getByRole("button", {
      name: "Add Instructions",
    });
    await user.type(
      screen.getByRole("textbox", { name: "Instruction 1" }),
      "Heat up pan",
    );

    await user.click(addInstructionButton);
    await user.type(
      screen.getByRole("textbox", { name: "Instruction 2" }),
      "Cook until golden brown",
    );

    await user.click(addInstructionButton);
    await user.type(
      screen.getByRole("textbox", { name: "Instruction 3" }),
      "Serve and enjoy!",
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        name: "Scrambled Eggs",
        ingredients: [
          { amount: 1, unit: "kg", name: "eggs" },
          { amount: 200, unit: "g", name: "cheese" },
        ],
        instructions: [
          "Heat up pan",
          "Cook until golden brown",
          "Serve and enjoy!",
        ],
        uploadedImageName: null,
      }),
    );
  });

  test("Displays validation errors", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(() => <NewRecipeForm onSubmit={handleSubmit} />, {
      wrapper: ProviderWrapper,
    });

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByRole("textbox", { name: "Recipe name" }),
    ).not.toBeValid();
    screen.getByText("Please enter a name for the recipe");

    const firstIngredientInputs = getIngredientInputs(
      screen.getByRole("group", { name: "Ingredient 1" }),
    );
    expect(firstIngredientInputs.amount).not.toBeValid();
    screen.getByText("Please enter an amount greater than zero");
    expect(firstIngredientInputs.unit);
    screen.getByText("Please enter a unit");
    expect(firstIngredientInputs.nameInput).not.toBeValid();
    screen.getByText("Please enter an ingredient");

    expect(
      screen.getByRole("textbox", { name: "Instruction 1" }),
    ).not.toBeValid();
    screen.getByText("Field cannot be empty");
  });
});
