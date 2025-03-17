import { beforeAll, describe, test, vi } from "vitest";
import { render, screen, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import ProviderWrapper from "@/testing/ProviderWrapper";
import DeleteRecipeDialog from "./DeleteRecipeDialog";

describe("Delete Recipe Dialog", () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  test("opens dialog when trigger is pressed", async () => {
    render(() => <DeleteRecipeDialog recipeId="1" />, {
      wrapper: ProviderWrapper,
    });

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    screen.getByRole("dialog");
    screen.getByText(
      /Are you sure you want to delete this recipe\?Doing so is irreversible./,
    );
    screen.getByRole("button", { name: "Dismiss" });
    screen.getByRole("button", { name: "Cancel" });

    const dialogDeleteButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(dialogDeleteButton);

    const toast = await screen.findByRole("status");
    within(toast).getByText("Success");
    within(toast).getByText("Recipe deleted.");
  });
});
