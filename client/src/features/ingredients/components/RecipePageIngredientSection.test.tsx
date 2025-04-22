import customRender from "@/testing/customRender";
import { describe, test, vi } from "vitest";
import RecipePageIngredientSection from "./RecipePageIngredientSection";
import { screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

describe("Recipe Page Ingredient Section", () => {
  const setup = async () => {
    const handleIngredientsUpdate = vi.fn();
    customRender(() => (
      <RecipePageIngredientSection
        ingredients={[
          { unit: "g", amount: 250, name: "all-purpose flour" },
          { unit: "g", amount: 150, name: "butter" },
          { unit: "g", amount: 200, name: "chocolate chips" },
          { unit: "oz", amount: 1, name: "vanilla extract" },
          { unit: "g", amount: 100, name: "brown sugar" },
        ]}
        userOwnsRecipe
        handleIngredientsUpdate={handleIngredientsUpdate}
      />
    ));
    await screen.findByRole("heading", { name: "Ingredients" });
  };

  test("is able to display ingredients", async () => {
    await setup();

    screen.getByText("250 g all-purpose flour");
    screen.getByText("150 g butter");
    screen.getByText("200 g chocolate chips");
    screen.getByText("1 oz vanilla extract");
    screen.getByText("100 g brown sugar");
  });

  test("is able to convert units to lb", async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Customize units of measurement" }),
    );
    await user.click(
      screen.getByRole("menuitemcheckbox", { name: "Convert units" }),
    );
    await user.click(screen.getByRole("menuitemradio", { name: "Imperial" }));
    await user.click(
      screen.getByRole("menuitemradio", { name: "Pounds (lb)" }),
    );

    screen.getByText("0.5512 lb all-purpose flour");
    screen.getByText("0.3307 lb butter");
    screen.getByText("0.4409 lb chocolate chips");
    screen.getByText("0.0625 lb vanilla extract");
    screen.getByText("0.2205 lb brown sugar");
  });

  test("is able to convert units to kg", async () => {
    await setup();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole("button", { name: "Customize units of measurement" }),
    );
    await user.click(
      screen.getByRole("menuitemcheckbox", { name: "Convert units" }),
    );
    await user.click(screen.getByRole("menuitemradio", { name: "Metric" }));
    await user.click(
      screen.getByRole("menuitemradio", { name: "Kilograms (kg)" }),
    );

    screen.getByText("0.2500 kg all-purpose flour");
    screen.getByText("0.1500 kg butter");
    screen.getByText("0.2000 kg chocolate chips");
    screen.getByText("0.0283 kg vanilla extract");
    screen.getByText("0.1000 kg brown sugar");
  });
});
