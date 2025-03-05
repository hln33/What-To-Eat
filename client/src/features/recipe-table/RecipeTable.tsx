import {
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/solid-table";
import { Recipe } from "../../types";
import { Component, For } from "solid-js";
import { getIngredientStatus } from "./utils";

type TableData = Recipe & { status: string };

const columnHelper = createColumnHelper<TableData>();
const columns = [
  columnHelper.accessor("name", {
    cell: (info) => <span class="text-red-400">{info.getValue()}</span>,
  }),
  columnHelper.accessor("ingredients", {
    cell: (info) => (
      <span class="text-green-300">
        {info.getValue().reduce((acc, ingredient) => `${acc}, ${ingredient}`)}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    cell: (info) => <span class="text-yellow-300">{info.getValue()}</span>,
  }),
];

const RecipeTable: Component<{
  recipes: Recipe[];
  providedIngredients: Set<string>;
}> = (props) => {
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
    });

  return (
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
            <tr>
              <For each={row.getVisibleCells()}>
                {(cell) => (
                  <td>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default RecipeTable;
