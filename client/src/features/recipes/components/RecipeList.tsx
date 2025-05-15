import { Component, createSignal, For } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import {
  ColumnFiltersState,
  createColumnHelper,
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";

import { useUserContext } from "@/contexts/UserContext";
import { userQueries } from "@/features/users/queries";
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
  columnHelper.accessor("ingredientStatus", {
    sortingFn: (rowA, rowB) =>
      rowA.original.ingredientStatus.missingIngredients.size -
      rowB.original.ingredientStatus.missingIngredients.size,
  }),
  columnHelper.accessor("creator", {}),
];

const RecipeList: Component<{
  recipes: FetchedRecipe[];
  providedIngredients: Set<string>;
}> = (props) => {
  const user = useUserContext();
  const favoriteRecipesQuery = createQuery(() =>
    userQueries.favoriteRecipesList(user.info),
  );

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
      getSortedRowModel: getSortedRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination: pagination(),
        columnFilters: columnFilters(),
        sorting: [{ id: "ingredientStatus", desc: false }],
      },
    });

  return (
    <section class="space-y-5">
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
      <RecipeListFooter table={table()} />
    </section>
  );
};

export default RecipeList;
