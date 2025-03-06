import { createForm, required } from "@modular-forms/solid";
import TextField from "../../components/TextField";
import Button from "../../components/Button";

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [form, { Form, Field }] = createForm<LoginForm>();

  const handleLogin = () => {
    console.log("logging in!");
  };

  return (
    <div>
      Login Page
      <Form
        class="space-y-8"
        onsubmit={handleLogin}
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

        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
};

export default LoginPage;
