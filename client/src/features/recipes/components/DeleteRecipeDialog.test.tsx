import { describe, expect, test } from "vitest";
import { render, screen, waitFor, within } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import ProviderWrapper from "@/testing/ProviderWrapper";
import DeleteRecipeDialog from "./DeleteRecipeDialog";

describe("Delete Recipe Dialog", () => {
  const setup = async () => {
    render(() => <DeleteRecipeDialog recipeId="1" />, {
      wrapper: ProviderWrapper,
    });
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    const dialog = screen.getByRole("dialog");
    screen.getByText(
      /Are you sure you want to delete this recipe\?Doing so is irreversible./,
    );
    return {
      dismissButton: within(dialog).getByRole("button", {
        name: "Dismiss",
      }),
      cancelButton: within(dialog).getByRole("button", { name: "Cancel" }),
      deleteButton: within(dialog).getByRole("button", { name: "Delete" }),
    };
  };

  test("opens dialog when trigger is pressed", async () => {
    const { deleteButton } = await setup();

    await userEvent.click(deleteButton);

    const toast = await screen.findByRole("status");
    within(toast).getByText("Success");
    within(toast).getByText("Recipe deleted.");
  });

  test("close dialog when cancel button is pressed", async () => {
    const { cancelButton } = await setup();

    await userEvent.click(cancelButton);

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: "Delete" })[0],
      ).toHaveAttribute("aria-expanded", "false"),
    );
  });
});
