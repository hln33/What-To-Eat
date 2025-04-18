import { Show } from "solid-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import { createMutation } from "@tanstack/solid-query";

import { login } from "@/features/users/api";
import LoginForm, { type LoginFormValues } from "@/features/users/LoginForm";
import { useUserContext } from "@/contexts/UserContext";

const Login = () => {
  const user = useUserContext();
  const navigate = useNavigate();

  const loginUser = createMutation(() => ({
    mutationFn: login,
    onSuccess: (data) => user.login(data.userId, data.username),
  }));

  const handleLogin = (credentials: LoginFormValues) => {
    loginUser.mutate(credentials, {
      onSuccess: () => navigate({ to: "/" }),
    });
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign in to \App Name\</div>
      <Show when={loginUser.isError}>
        <div class="text-red-500">{loginUser.error?.message}</div>
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
