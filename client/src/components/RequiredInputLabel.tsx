import { Component } from "solid-js";

const RequiredInputLabel: Component<{ label: string }> = (props) => {
  return (
    <span class="after:ml-1 after:text-red-500 after:content-['*']">
      {props.label}
    </span>
  );
};

export default RequiredInputLabel;
