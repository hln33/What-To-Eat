import { Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import {
  createForm,
  minLength,
  required,
  SubmitHandler,
} from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import { registerUser } from "@/features/users/api";

type SignupForm = {
  username: string;
  password: string;
};

export const SignupPage = () => {
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm<SignupForm>();

  const createUser = createMutation(() => ({
    mutationFn: registerUser,
  }));

  const handleSignup: SubmitHandler<SignupForm> = async (credentials) => {
    createUser.mutate(credentials, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign up to \App Name\</div>

      <Show when={createUser.isError}>
        <div class="text-red-500">{createUser.error?.message}</div>
      </Show>
      <Form
        class="space-y-5"
        onSubmit={handleSignup}
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
          validate={[
            required("Password cannot be empty."),
            minLength(10, "Password must be at least 10 characters long"),
          ]}
        >
          {(field, props) => (
            <TextField
              {...props}
              type="password"
              label="Password"
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
          Continue
        </Button>
      </Form>

      <A
        class="block text-sm"
        href="/login"
      >
        Already have an account?{" "}
        <span class="font-semibold underline">sign in</span>
      </A>
    </div>
  );
};
