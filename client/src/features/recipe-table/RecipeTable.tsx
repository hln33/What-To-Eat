import { Component, createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { Recipe } from "../../types";
import { getRecipesWithIngredientStatus } from "./utils";

type TableData = Recipe & { status: string };

const columnHelper = createColumnHelper<TableData>();
const columns = [
  columnHelper.accessor("name", {
    header: () => <div>Name</div>,
    cell: (info) => <div class="text-red-400">{info.getValue()}</div>,
  }),
  columnHelper.accessor("ingredients", {
    header: () => <div>Ingredients</div>,
    cell: (info) => (
      <div class="text-green-300">
        {info.getValue().reduce((acc, ingredient) => `${acc}, ${ingredient}`)}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: () => <div>Status</div>,
    cell: (info) => <div class="text-yellow-300">{info.getValue()}</div>,
  }),
];

const RecipeTable: Component<{
  recipes: Recipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = createSignal({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = () =>
    createSolidTable({
      columns,
      data: getRecipesWithIngredientStatus(
        props.recipes,
        props.providedIngredients,
      ),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination: pagination(),
      },
    });

  return (
    <div>
      <table class="border-collapse border border-gray-500 text-left [&_td]:px-4 [&_th]:px-4">
        <thead>
          <For each={table().getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="border-b border-gray-400">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table().getRowModel().rows}>
            {(row) => (
              <tr
                class="cursor-pointer hover:bg-zinc-500"
                onClick={() => navigate(`/recipe/${row.id}`)}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="border-b border-gray-400">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <div class="border-x border-b border-gray-400 p-2">
        <div>
          <span class="font-medium">
            {table().getState().pagination.pageIndex * 10 + 1}
          </span>{" "}
          to{" "}
          <span class="font-medium">
            {table().getState().pagination.pageSize +
              table().getState().pagination.pageIndex * 10}
          </span>{" "}
          of <span class="font-medium">{table().getRowCount()}</span>
        </div>

        <div class="flex justify-between">
          <button
            onClick={() => table().previousPage()}
            disabled={!table().getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            onClick={() => table().nextPage()}
            disabled={!table().getCanNextPage()}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeTable;
