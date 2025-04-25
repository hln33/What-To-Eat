import { Show } from "solid-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";

import LoginForm, { type LoginFormValues } from "@/features/users/LoginForm";
import { createUserLoginMutaton } from "@/features/users/queries";

const Login = () => {
  const navigate = useNavigate();

  const loginUserMutation = createUserLoginMutaton();

  const handleLogin = (credentials: LoginFormValues) => {
    loginUserMutation.mutate(credentials, {
      onSuccess: () => navigate({ to: "/" }),
    });
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign in to \App Name\</div>
      <Show when={loginUserMutation.isError}>
        <div class="text-red-500">{loginUserMutation.error?.message}</div>
      </Show>

      <LoginForm onSubmit={handleLogin} />
      <Link
        to="/signup"
        class="block text-sm font-semibold underline"
      >
        Create an account
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: Login,
});
