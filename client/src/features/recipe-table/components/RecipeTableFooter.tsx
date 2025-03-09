import { Component } from "solid-js";
import { Table } from "@tanstack/solid-table";
import { TableData } from "../types";

const RecipeTableFooter: Component<{ table: Table<TableData> }> = (props) => {
  const pagination = () => props.table.getState().pagination;

  return (
    <div class="border-x border-b border-gray-400 p-2">
      <div>
        <span class="font-medium">{pagination().pageIndex * 10 + 1}</span> to{" "}
        <span class="font-medium">
          {pagination().pageSize + pagination().pageIndex * 10}
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
