import { Show } from "solid-js";
import { createFileRoute, Link, useNavigate } from "@tanstack/solid-router";
import {
  createForm,
  minLength,
  required,
  SubmitHandler,
} from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "@/components/ui/Toast";
import { createUserRegisterMutation } from "@/features/users/queries";

type SignupForm = {
  username: string;
  password: string;
};

export const Signup = () => {
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm<SignupForm>();

  const registerUserMutation = createUserRegisterMutation();

  const handleSignup: SubmitHandler<SignupForm> = async (credentials) => {
    registerUserMutation.mutate(credentials, {
      onSuccess: () => {
        toast.success("You have successfully signed up! Please log in.");
        navigate({ to: "/login" });
      },
    });
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign up to \App Name\</div>

      <Show when={registerUserMutation.isError}>
        <div class="text-red-500">{registerUserMutation.error?.message}</div>
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
          Continue
        </Button>
      </Form>

      <Link
        to="/login"
        class="block text-sm"
      >
        Already have an account?{" "}
        <span class="font-semibold underline">sign in</span>
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/signup")({
  component: Signup,
});
