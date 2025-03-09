import { Component, createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { Recipe } from "../../../types";
import { getRecipesWithIngredientStatus } from "../utils";
import RecipeTableFooter from "./RecipeTableFooter";
import { TableData } from "../types";

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
      <table class="border-collapse border border-gray-500 text-left">
        <thead>
          <For each={table().getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th class="border-b border-gray-400 p-4">
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
                onClick={() => navigate(`/recipe/${row.original.id}`)}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="border-b border-gray-400 px-4 py-2">
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
      <RecipeTableFooter table={table()} />
    </div>
  );
};

export default RecipeTable;
