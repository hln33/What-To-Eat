import { A, useNavigate } from "@solidjs/router";
import { createForm, required } from "@modular-forms/solid";
import { useUserContext } from "@/contexts/UserContext";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { login } from "@/api";

type LoginForm = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const user = useUserContext();
  const navigate = useNavigate();
  const [form, { Form, Field }] = createForm<LoginForm>();

  const handleLogin = async () => {
    const isSuccess = await login();
    if (isSuccess) {
      user.setIsLoggedin(true);
      navigate("/");
    }
  };

  return (
    <div class="space-y-5">
      <div class="text-lg">Sign in to \App Name\</div>
      <div>{user.isLoggedin() ? "logged in" : "not logged in"}</div>
      <Form
        class="space-y-5"
        onsubmit={() => handleLogin()}
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
