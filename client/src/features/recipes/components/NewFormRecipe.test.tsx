import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import ProviderWrapper from "@/testing/ProviderWrapper";
import NewRecipeForm from "./NewRecipeForm";

describe("New Recipe Form", () => {
  test("Can submit a new recipe", async () => {
    const handleSubmit = vi.fn();
    render(() => <NewRecipeForm onSubmit={handleSubmit} />, {
      wrapper: ProviderWrapper,
    });

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Recipe Name",
      }),
      "Scrambled Eggs",
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Ingredients Show suggestions" }),
    );
    const ingredientList = screen.getByRole("listbox", {
      name: "Ingredients Suggestions",
    });
    await userEvent.click(
      within(ingredientList).getByRole("option", { name: "eggs" }),
    );
    await userEvent.click(
      within(ingredientList).getByRole("option", { name: "cheese" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Remove cheese from selection" }),
    );
    await userEvent.click(
      within(ingredientList).getByRole("option", { name: "pepper" }),
    );

    const addInstructionButton = screen.getByRole("button", {
      name: "Add another instruction",
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: "instructions.0" }),
      "Heat up pan",
    );
    await userEvent.click(addInstructionButton);
    await userEvent.type(
      screen.getByRole("textbox", { name: "instructions.1" }),
      "Cook until golden brown",
    );
    await userEvent.click(addInstructionButton);
    await userEvent.type(
      screen.getByRole("textbox", { name: "instructions.2" }),
      "Serve on plate and enjoy!",
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        name: "Scrambled Eggs",
        ingredients: ["eggs", "pepper"],
        instructions: [
          "Heat up pan",
          "Cook until golden brown",
          "Serve on plate and enjoy!",
        ],
      }),
    );
  });

  test("Displays validation errors", async () => {
    const handleSubmit = vi.fn();
    render(() => <NewRecipeForm onSubmit={handleSubmit} />, {
      wrapper: ProviderWrapper,
    });

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByRole("textbox", { name: "Recipe Name" }),
    ).not.toBeValid();
    screen.getByText("Please enter a name for the recipe.");

    expect(
      screen.getByRole("combobox", { name: "Ingredients" }),
    ).not.toBeValid();
    screen.getByText("Please enter ingredients.");

    expect(
      screen.getByRole("textbox", { name: "instructions.0" }),
    ).not.toBeValid();
    screen.getByText("Field cannot be empty.");
  });
});
