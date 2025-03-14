import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

const DeleteRecipeDialog = () => {
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
          <Button variant="subtle">Cancel</Button>
          <Button color="red">Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeDialog;
