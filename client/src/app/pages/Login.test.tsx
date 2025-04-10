import { beforeEach, describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

import { mockServer } from "@/testing/mockServer";
import ProviderWrapper from "@/testing/ProviderWrapper";
import LoginPage from "./Login";

describe("Login Page", () => {
  beforeEach(async () => {
    mockServer.use(
      http.get("http://localhost:3001/users/session", () => {
        return HttpResponse.json(
          {
            message: "Invalid session.",
          },
          { status: 401 },
        );
      }),
    );

    render(() => <LoginPage />, {
      wrapper: ProviderWrapper,
    });
    await screen.findByRole("link", { name: "Home" });
    await screen.findByRole("link", { name: "Login" });
  });

  test("allows user to login", async () => {
    await userEvent.type(
      screen.getByRole("textbox", { name: "User Name" }),
      "john smith",
    );
    await userEvent.type(
      screen.getByLabelText("Password"),
      "mysupersecretpassword123",
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await screen.findByRole("link", { name: "Logout" });
  });

  test("enforces validation errors", async () => {
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

    await userEvent.click(screen.getByRole("button", { name: "Login" }));
    await screen.findByRole("link", { name: "Logout" });
  });
});
