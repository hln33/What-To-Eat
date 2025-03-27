import { Component, createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  ColumnFiltersState,
  createColumnHelper,
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";

import { useUserContext } from "@/contexts/UserContext";
import { getRecipesWithIngredientStatus } from "../utils";
import { Recipe, RecipeTableData } from "../types";
import RecipeTableFooter from "./RecipeTableFooter";
import RecipeTableCellStatus from "./RecipeTableCellStatus";

const columnHelper = createColumnHelper<RecipeTableData>();
const columns = [
  columnHelper.accessor("name", {
    header: () => <div>Name</div>,
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("ingredients", {
    header: () => <div>Ingredients</div>,
    cell: (info) => (
      <ul class="list-outside list-disc">
        <For each={info.getValue()}>
          {(ingredient) => <li>{ingredient}</li>}
        </For>
      </ul>
    ),
  }),
  columnHelper.accessor("ingredientStatus", {
    header: () => <div>Status</div>,
    cell: (info) => <RecipeTableCellStatus {...info} />,
  }),
  columnHelper.accessor("creator", {
    header: () => <div>Creator</div>,
    cell: (info) => <div>{info.getValue()}</div>,
  }),
];

const RecipeTable: Component<{
  recipes: Recipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const user = useUserContext();
  const navigate = useNavigate();

  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
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
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination: pagination(),
        columnFilters: columnFilters(),
      },
    });

  return (
    <>
      <div class="flex gap-2">
        <input
          type="checkbox"
          id="show-my-recipes"
          onClick={(e) =>
            setColumnFilters([
              {
                id: "creator",
                value: e.currentTarget.checked ? user.info.name : "",
              },
            ])
          }
        />
        <label for="show-my-recipes">Show my Recipes</label>
      </div>

      <div class="flex flex-col rounded border border-gray-600 shadow-xl">
        <table class="border-collapse rounded-t-full text-left capitalize">
          <thead>
            <For each={table().getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th class="border-b-2 border-gray-600 p-3">
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
                  class="cursor-pointer align-top hover:bg-zinc-500"
                  onClick={() => navigate(`/recipe/${row.original.id}`)}
                >
                  <For each={row.getVisibleCells()}>
                    {(cell) => (
                      <td class="relative border-b border-gray-600 p-3">
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
        <RecipeTableFooter
          class="border-gray-600 p-2"
          table={table()}
        />
      </div>
    </>
  );
};

export default RecipeTable;
