import { Component } from "solid-js";
import { Table } from "@tanstack/solid-table";
import ChevronLeftIcon from "~icons/lucide/chevron-left";
import ChevronRightIcon from "~icons/lucide/chevron-right";

import { RecipeTableData } from "../types";
import { twMerge } from "tailwind-merge";
import Button from "@/components/ui/Button";

const RecipeListFooter: Component<{
  class?: string;
  table: Table<RecipeTableData>;
}> = (props) => {
  const pagination = () => props.table.getState().pagination;
  const scrollToTopOfPage = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div class={twMerge("space-y-2", props.class)}>
      <div class="flex items-center justify-center gap-4">
        <Button
          class="p-2"
          size="sm"
          variant="outline"
          onClick={() => {
            props.table.previousPage();
            scrollToTopOfPage();
          }}
          disabled={!props.table.getCanPreviousPage()}
        >
          <ChevronLeftIcon class="size-6" />
        </Button>

        <span class="text-lg">Page {pagination().pageIndex + 1}</span>

        <Button
          class="p-2"
          size="sm"
          variant="outline"
          onClick={() => {
            props.table.nextPage();
            scrollToTopOfPage();
          }}
          disabled={!props.table.getCanNextPage()}
        >
          <ChevronRightIcon class="size-6" />
        </Button>
      </div>

      <div class="font-extralight">
        {pagination().pageIndex * pagination().pageSize + 1} to{" "}
        {Math.min(
          pagination().pageSize + pagination().pageIndex * 10,
          props.table.getRowCount(),
        )}{" "}
        of {props.table.getRowCount()} recipes
      </div>
    </div>
  );
};

export default RecipeListFooter;
