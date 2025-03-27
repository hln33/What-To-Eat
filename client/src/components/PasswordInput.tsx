import { Component, createSignal, JSX } from "solid-js";
import ClosedEyeIcon from "~icons/lucide/eye-closed";
import OpenedEyeIcon from "~icons/lucide/eye";
import TextField from "./ui/TextField";

type Props = {
  value: string | undefined;
  error: string;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
} & JSX.InputHTMLAttributes<HTMLInputElement>;

const PasswordInput: Component<Props> = (props) => {
  const [passwordVisible, setPasswordVisible] = createSignal(false);
  const togglePasswordVisibility = () => setPasswordVisible((value) => !value);

  return (
    <TextField
      {...props}
      type={passwordVisible() ? "text" : "password"}
      label="Password"
      value={props.value}
      error={props.error}
      disabled={props.disabled}
      icon={
        passwordVisible() ? (
          <OpenedEyeIcon
            class="size-6 cursor-pointer text-slate-700"
            onClick={togglePasswordVisibility}
          />
        ) : (
          <ClosedEyeIcon
            class="size-6 cursor-pointer text-slate-700"
            onClick={togglePasswordVisibility}
          />
        )
      }
    />
  );
};

export default PasswordInput;
