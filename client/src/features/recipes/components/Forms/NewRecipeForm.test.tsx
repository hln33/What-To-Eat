import { describe, expect, test, vi } from "vitest";
import { screen, waitFor, within } from "@solidjs/testing-library";
import userEvent, { UserEvent } from "@testing-library/user-event";

import customRender from "@/testing/customRender";
import NewRecipeForm from "./NewRecipeForm";
import { IngredientUnit } from "@/features/ingredients/types";

describe("New Recipe Form", () => {
  const getIngredientInputs = (fieldset: HTMLElement) => {
    return {
      amount: within(fieldset).getByRole("spinbutton", { name: "Amount" }),
      unit: within(fieldset).getByRole("button", { name: "Unit g" }),
      nameTrigger: within(fieldset).getByRole("button", {
        name: "Name Show suggestions",
      }),
      nameInput: within(fieldset).getByRole("combobox", { name: "Name" }),
    };
  };

  const editIngredient = async (
    user: UserEvent,
    ingredientGroupName: string,
    values: { amount: number; unit: IngredientUnit; name: string },
  ) => {
    const secondIngredientInputs = getIngredientInputs(
      screen.getByRole("group", { name: ingredientGroupName }),
    );

    await user.type(secondIngredientInputs.amount, values.amount.toString());

    await user.click(secondIngredientInputs.unit);
    await user.click(screen.getByRole("option", { name: values.unit }));

    await user.click(secondIngredientInputs.nameTrigger);
    await user.click(screen.getByRole("option", { name: values.name }));

    removeListbox("Unit");
    removeListbox("Name Suggestions");
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
    customRender(() => <NewRecipeForm onSubmit={handleSubmit} />);

    await user.type(
      await screen.findByRole("textbox", {
        name: "Recipe name",
      }),
      "Scrambled Eggs",
    );
    await user.type(screen.getByRole("spinbutton", { name: "servings" }), "5");

    await editIngredient(user, "Ingredient 1", {
      amount: 1,
      unit: "kg",
      name: "eggs",
    });

    await user.click(screen.getByRole("button", { name: "Add ingredient" }));
    await editIngredient(user, "Ingredient 2", {
      amount: 200,
      unit: "lb",
      name: "cheese",
    });

    const addInstructionButton = screen.getByRole("button", {
      name: "Add instruction",
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

    // test if form inputs are valid
    [
      ...screen.getAllByRole("spinbutton"),
      ...screen.getAllByRole("combobox"),
    ].forEach((formInput) => expect(formInput).toBeValid());
    screen
      .getAllByRole("button")
      .forEach((button) => expect(button).not.toHaveAttribute("data-invalid"));

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        name: "Scrambled Eggs",
        servings: 5,
        ingredients: [
          { amount: 1, unit: "kg", name: "eggs" },
          { amount: 200, unit: "lb", name: "cheese" },
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
    customRender(() => <NewRecipeForm onSubmit={handleSubmit} />);

    await user.click(await screen.findByRole("button", { name: "Submit" }));

    expect(
      screen.getByRole("textbox", { name: "Recipe name" }),
    ).not.toBeValid();
    screen.getByText("Please enter a name for the recipe");

    expect(
      screen.getByRole("spinbutton", { name: "servings" }),
    ).not.toBeValid();
    screen.getByText("Please enter a serving amount greater than zero");

    const firstIngredientInputs = getIngredientInputs(
      screen.getByRole("group", { name: "Ingredient 1" }),
    );
    expect(firstIngredientInputs.amount).not.toBeValid();
    screen.getByText("Please enter an amount greater than zero");
    expect(firstIngredientInputs.unit);
    // screen.getByText("Please enter a unit");
    expect(firstIngredientInputs.nameInput).not.toBeValid();
    screen.getByText("Please enter an ingredient");

    expect(
      screen.getByRole("textbox", { name: "Instruction 1" }),
    ).not.toBeValid();
    screen.getByText("Field cannot be empty");
  });
});
