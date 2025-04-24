import { Component, createSignal, For, Show } from "solid-js";
import {
  ColumnFiltersState,
  createColumnHelper,
  createSolidTable,
  // flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import SearchIcon from "~icons/lucide/search";

import { useUserContext } from "@/contexts/UserContext";
import Input from "@/components/ui/Input";
import { getRecipesWithIngredientStatus } from "../utils";
import { Recipe, RecipeTableData } from "../types";
import RecipeTableFooter from "./RecipeTableFooter";
import RecipeCard from "./RecipeCard";

const columnHelper = createColumnHelper<RecipeTableData>();
const columns = [
  columnHelper.accessor("name", {
    header: () => <div>Name</div>,
  }),
  columnHelper.accessor("ingredients", {
    header: () => <div>Ingredients</div>,
  }),
  columnHelper.accessor("ingredientStatus", {
    header: () => <div>Status</div>,
  }),
  columnHelper.accessor("creator", {
    header: () => <div>Creator</div>,
  }),
];

const RecipeTable: Component<{
  recipes: Recipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const user = useUserContext();

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
      <Show when={user.info.isLoggedIn}>
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
      </Show>

      <Input
        placeholder="Search recipes"
        value={
          (columnFilters().find((filter) => filter.id === "name")
            ?.value as string) ?? ""
        }
        onInput={(e) =>
          setColumnFilters((prev) =>
            prev
              .filter((filter) => filter.id !== "name")
              .concat({ id: "name", value: e.currentTarget.value }),
          )
        }
        leftSection={<SearchIcon />}
      />

      <section class="flex flex-col items-center divide-y-2">
        <For each={table().getRowModel().rows}>
          {(row) => (
            <RecipeCard
              recipe={row.original}
              providedIngredients={props.providedIngredients}
            />
          )}
        </For>
      </section>

      <RecipeTableFooter
        class="border-gray-600 p-2"
        table={table()}
      />
    </>
  );
};

export default RecipeTable;
