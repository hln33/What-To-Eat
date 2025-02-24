import { Component } from "solid-js";

const InputError: Component<{ errorMessage: string }> = (props) => {
  return <div class="text-left text-red-500">{props.errorMessage}</div>;
};

export default InputError;
