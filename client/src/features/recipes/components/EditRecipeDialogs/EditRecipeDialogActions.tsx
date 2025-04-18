import { Component } from "solid-js";

import Button from "@/components/ui/Button";

export const EditRecipeDialogActions: Component<{ onClose: () => void }> = (
  props,
) => {
  return (
    <div class="mt-8 flex justify-end gap-4">
      <Button
        variant="subtle"
        onClick={props.onClose}
      >
        Cancel
      </Button>
      <Button
        color="blue"
        variant="filled"
        type="submit"
      >
        Save
      </Button>
    </div>
  );
};
