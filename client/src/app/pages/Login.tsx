import { Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import {
  createForm,
  FormError,
  required,
  SubmitHandler,
} from "@modular-forms/solid";
import { login } from "@/api";
import { useUserContext } from "@/contexts/UserContext";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const user = useUserContext();
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm<LoginForm>();

  const handleLogin: SubmitHandler<LoginForm> = async (credentials) => {
    const loginResult = await login(credentials);
    if (loginResult.error) {
      throw new FormError<LoginForm>(loginResult.error);
    }

    user.setIsLoggedin(true);
    navigate("/");
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign in to \App Name\</div>

      <Show when={form.response.status === "error"}>
        <div class="text-red-500">{form.response.message}</div>
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
          full
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
