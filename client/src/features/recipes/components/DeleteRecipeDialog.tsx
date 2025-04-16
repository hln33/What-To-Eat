import { Component, createSignal } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import { type DialogTriggerProps } from "@kobalte/core/dialog";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useDeleteRecipe } from "../mutations";

const DeleteRecipeDialog: Component<{ recipeId: string }> = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = createSignal(false);

  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    deleteRecipe.mutate(props.recipeId, {
      onSuccess: () => {
        toast.success("Recipe deleted.");
        navigate({ to: "/" });
      },
      onError: () => {
        toast.error("Failed to delete recipe.");
      },
    });
  };

  return (
    <Dialog
      open={open()}
      setOpen={setOpen}
    >
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button
            color="red"
            variant="outline"
            {...props}
          >
            Delete
          </Button>
        )}
      />

      <DialogContent title="Delete Recipe">
        <p class="block">
          Are you sure you want to delete this recipe?
          <br />
          Doing so is irreversible.
        </p>
        <div class="flex justify-end gap-4">
          <Button
            variant="subtle"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={deleteRecipe.isPending}
            loading={deleteRecipe.isPending}
            color="red"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeDialog;
