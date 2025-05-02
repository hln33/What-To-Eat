import { Component, createSignal, For } from "solid-js";
import {
  ColumnFiltersState,
  createColumnHelper,
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";

import { createUserFavoriteRecipesQuery } from "@/features/users/queries";
import { getRecipeTableData } from "../utils";
import { FetchedRecipe, RecipeTableData } from "../types";
import RecipeListFooter from "./RecipeListFooter";
import RecipeCard from "./RecipeCard";
import RecipeListHeader from "./RecipeListHeader";

const columnHelper = createColumnHelper<RecipeTableData>();
const columns = [
  columnHelper.accessor("isFavorited", {}),
  columnHelper.accessor("name", {}),
  columnHelper.accessor("ingredients", {}),
  columnHelper.accessor("ingredientStatus", {}),
  columnHelper.accessor("creator", {}),
];

const RecipeList: Component<{
  recipes: FetchedRecipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const favoriteRecipesQuery = createUserFavoriteRecipesQuery();
  const favoriteRecipeIds = (): number[] =>
    favoriteRecipesQuery.data?.map((entry) => entry.recipeId) ?? [];

  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = createSignal({
    pageIndex: 0,
    pageSize: 5,
  });
  const table = () =>
    createSolidTable({
      columns,
      data: getRecipeTableData(
        props.recipes,
        props.providedIngredients,
        favoriteRecipeIds(),
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
    <section>
      <RecipeListHeader
        columnFilters={columnFilters()}
        setColumnFilters={setColumnFilters}
      />
      <div class="flex flex-col items-center divide-y-2">
        <For each={table().getRowModel().rows}>
          {(row) => (
            <RecipeCard
              recipe={row.original}
              providedIngredients={props.providedIngredients}
            />
          )}
        </For>
      </div>
      <RecipeListFooter
        class="mt-5"
        table={table()}
      />
    </section>
  );
};

export default RecipeList;
