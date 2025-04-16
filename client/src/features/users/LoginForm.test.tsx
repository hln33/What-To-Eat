import { beforeEach, describe, expect, test, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen, waitFor } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import { MOCK_SERVER_ORIGIN, mockServer } from "@/testing/mockServer";
import customRender from "@/testing/customRender";
import LoginForm from "./LoginForm";

describe("Login Form", () => {
  beforeEach(async () => {
    mockServer.use(
      http.get(`${MOCK_SERVER_ORIGIN}/users/session`, () => {
        return HttpResponse.json(
          {
            message: "Invalid session.",
          },
          { status: 401 },
        );
      }),
    );
  });

  const setup = async () => {
    const onSubmit = vi.fn();
    customRender(() => <LoginForm onSubmit={onSubmit} />);
    await screen.findByRole("button", { name: "Login" });

    return {
      onSubmit,
    };
  };

  test("allows user to login", async () => {
    const { onSubmit } = await setup();

    await userEvent.type(
      screen.getByRole("textbox", { name: "User Name" }),
      "john smith",
    );
    await userEvent.type(
      screen.getByLabelText("Password"),
      "mysupersecretpassword123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        username: "john smith",
        password: "mysupersecretpassword123",
      }),
    );
  });

  test("enforces validation errors", async () => {
    await setup();
    await userEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(screen.getByRole("textbox", { name: "User Name" })).not.toBeValid();
    expect(screen.getByLabelText("Password")).not.toBeValid();

    await userEvent.type(
      screen.getByRole("textbox", { name: "User Name" }),
      "john smith",
    );
    await userEvent.type(screen.getByLabelText("Password"), "tooshort");
    expect(screen.getByRole("textbox", { name: "User Name" })).toBeValid();
    expect(screen.getByLabelText("Password")).toBeValid();
  });
});
