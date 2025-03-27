import { Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { createForm, required, SubmitHandler } from "@modular-forms/solid";

import { useUserContext } from "@/contexts/UserContext";
import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/PasswordInput";
import { login } from "@/features/users/api";

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const user = useUserContext();
  const navigate = useNavigate();

  const [form, { Form, Field }] = createForm<LoginForm>();
  const loginUser = createMutation(() => ({
    mutationFn: login,
    onSuccess: (data) => user.login(data.userId, data.username),
  }));

  const handleLogin: SubmitHandler<LoginForm> = async (credentials) => {
    loginUser.mutate(credentials, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign in to \App Name\</div>

      <Show when={loginUser.isError}>
        <div class="text-red-500">{loginUser.error?.message}</div>
      </Show>
      <Form
        class="space-y-5"
        onSubmit={handleLogin}
      >
        <Field
          name="username"
          validate={[required("User name cannot be empty.")]}
        >
          {(field, props) => (
            <TextField
              {...props}
              type="text"
              label="User Name"
              value={field.value}
              error={field.error}
              disabled={form.submitting}
            />
          )}
        </Field>
        <Field
          name="password"
          validate={[required("Password cannot be empty.")]}
        >
          {(field, props) => (
            <PasswordInput
              {...props}
              value={field.value}
              error={field.error}
              disabled={form.submitting}
            />
          )}
        </Field>

        <Button
          fullWidth
          type="submit"
        >
          Login
        </Button>
      </Form>

      <A
        class="block text-sm"
        href="/signup"
      >
        Create an account
      </A>
    </div>
  );
};

export default LoginPage;
