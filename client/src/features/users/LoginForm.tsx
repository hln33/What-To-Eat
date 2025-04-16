import { Component } from "solid-js";
import { createForm, required } from "@modular-forms/solid";

import TextField from "@/components/ui/TextField";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/PasswordInput";

export type LoginFormValues = {
  username: string;
  password: string;
};

const LoginForm: Component<{
  onSubmit: (credentials: LoginFormValues) => void;
}> = (props) => {
  const [form, { Form, Field }] = createForm<LoginFormValues>();

  return (
    <Form
      class="space-y-5"
      onSubmit={(values) => props.onSubmit(values)}
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
  );
};

export default LoginForm;
