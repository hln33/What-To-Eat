import { Component, createSignal, For, Show } from "solid-js";
import {
  ColumnFiltersState,
  createColumnHelper,
  createSolidTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import SearchIcon from "~icons/lucide/search";

import { createUserFavoriteRecipesQuery } from "@/features/users/queries";
import { useUserContext } from "@/contexts/UserContext";
import Input from "@/components/ui/Input";
import { getRecipeTableData } from "../utils";
import { FetchedRecipe, RecipeTableData } from "../types";
import RecipeListFooter from "./RecipeListFooter";
import RecipeCard from "./RecipeCard";

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
  const user = useUserContext();

  const favoriteRecipesQuery = createUserFavoriteRecipesQuery();
  const favoriteRecipeIds = (): number[] =>
    favoriteRecipesQuery.data?.map((entry) => entry.recipeId) ?? [];

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
        <div class="flex gap-2">
          <input
            type="checkbox"
            id="show-my-favorites"
            onClick={(e) => {
              if (e.currentTarget.checked) {
                setColumnFilters([
                  {
                    id: "isFavorited",
                    value: true,
                  },
                ]);
              } else {
                setColumnFilters((prev) =>
                  prev.filter(
                    (columnFilter) => columnFilter.id !== "isFavorited",
                  ),
                );
              }
            }}
          />
          <label for="show-my-favorites">Show my favorites</label>
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

      <RecipeListFooter
        class="border-gray-600 p-2"
        table={table()}
      />
    </>
  );
};

export default RecipeList;
