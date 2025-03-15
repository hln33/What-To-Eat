import { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { useDeleteRecipe } from "../mutations";
import { toast } from "@/components/ui/Toast";

const DeleteRecipeDialog: Component<{ recipeId: string }> = (props) => {
  const navigate = useNavigate();
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    deleteRecipe.mutate(props.recipeId, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <Dialog>
      <DialogTrigger as="div">
        <Button
          color="red"
          variant="outline"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent title="Delete Recipe">
        <p class="my-8 block">
          Are you sure you want to delete this recipe? <br />
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
