import { Component, createSignal, For } from "solid-js";
import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import { Recipe } from "../../types";
import { getIngredientStatus } from "./utils";
import { A, useNavigate } from "@solidjs/router";

type TableData = Recipe & { status: string };

const columnHelper = createColumnHelper<TableData>();
const columns = [
  columnHelper.accessor("name", {
    cell: (info) => <div class="w-32 text-red-400">{info.getValue()}</div>,
  }),
  columnHelper.accessor("ingredients", {
    cell: (info) => (
      <div class="w-32 text-green-300">
        {info.getValue().reduce((acc, ingredient) => `${acc}, ${ingredient}`)}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    cell: (info) => <div class="w-32 text-yellow-300">{info.getValue()}</div>,
  }),
];

const RecipeTable: Component<{
  recipes: Recipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const navigate = useNavigate();
  const [pagination, setPagination] = createSignal({
    pageIndex: 0,
    pageSize: 5,
  });

  const tableData = () =>
    props.recipes.map((recipe) => {
      const requiredIngredients = new Set(recipe.ingredients);
      const status = getIngredientStatus(
        requiredIngredients,
        props.providedIngredients,
      );
      return { ...recipe, status };
    });
  const table = () =>
    createSolidTable({
      columns,
      data: tableData(),
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination: pagination(),
      },
    });

  return (
    <>
      <table>
        <thead>
          <For each={table().getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th>
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
                class="cursor-pointer"
                onClick={() => navigate(`/recipe/${row.id}`)}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td>
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
    </>
  );
};

export default RecipeTable;
