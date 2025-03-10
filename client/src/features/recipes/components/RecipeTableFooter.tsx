import { Component } from "solid-js";
import { Table } from "@tanstack/solid-table";
import { RecipeTableData } from "../types";

const RecipeTableFooter: Component<{
  class?: string;
  table: Table<RecipeTableData>;
}> = (props) => {
  const pagination = () => props.table.getState().pagination;

  return (
    <div class={props.class}>
      <div>
        <span class="font-medium">{pagination().pageIndex * 10 + 1}</span> to{" "}
        <span class="font-medium">
          {Math.min(
            pagination().pageSize + pagination().pageIndex * 10,
            props.table.getRowCount(),
          )}
        </span>{" "}
        of <span class="font-medium">{props.table.getRowCount()}</span>
      </div>

      <div class="flex justify-between">
        <button
          onClick={() => props.table.previousPage()}
          disabled={!props.table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          onClick={() => props.table.nextPage()}
          disabled={!props.table.getCanNextPage()}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default RecipeTableFooter;
