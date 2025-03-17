import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { type DialogTriggerProps } from "@kobalte/core/dialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useDeleteRecipe } from "../mutations";

const DeleteRecipeDialog: Component<{ recipeId: string }> = (props) => {
  const navigate = useNavigate();
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    deleteRecipe.mutate(props.recipeId, {
      onSuccess: () => {
        toast.success("Recipe deleted.");
        navigate("/");
      },
    });
  };

  return (
    <Dialog>
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
        <p class="my-8 block">
          Are you sure you want to delete this recipe?
          <br />
          Doing so is irreversible.
        </p>
        <div class="flex justify-end gap-4">
          <Button
            variant="subtle"
            onClick={() => toast.success("test success")}
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
