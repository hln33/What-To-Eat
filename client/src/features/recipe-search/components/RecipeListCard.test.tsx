import { cleanup, render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import RecipeListCard from "./RecipeListCard";

describe("<RecipeListCard />", () => {
  afterEach(() => {
    cleanup();
  });

  test("it notifies the user that they have all ingredients", () => {
    const { getByRole } = render(() => (
      <RecipeListCard
        name="Fried Garlic and Onions"
        requiredIngredients={new Set(["garlic", "onion"])}
        providedIngredients={new Set(["garlic", "onion"])}
      />
    ));

    expect(getByRole("note")).toHaveTextContent("You have all ingredients");
  });

  test("it notifies the user how many ingredients are missing", () => {
    const { getByRole } = render(() => (
      <RecipeListCard
        name="Fried Garlic and Onions"
        requiredIngredients={new Set(["garlic", "onion", "olive oil"])}
        providedIngredients={new Set(["garlic"])}
      />
    ));

    expect(getByRole("note")).toHaveTextContent(
      "You are missing 2 ingredients",
    );
  });

  test("it notifies the user that all ingredients are missing", () => {
    const { getByRole } = render(() => (
      <RecipeListCard
        name="Fried Garlic and Onions"
        requiredIngredients={new Set(["garlic", "onion", "olive oil"])}
        providedIngredients={new Set([])}
      />
    ));

    expect(getByRole("note")).toHaveTextContent(
      "You are missing all ingredients",
    );
  });
});
