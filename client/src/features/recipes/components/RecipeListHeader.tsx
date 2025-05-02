import { Component, Setter, Show } from "solid-js";
import { ColumnFiltersState } from "@tanstack/solid-table";
import FilterIcon from "~icons/lucide/filter";
import SearchIcon from "~icons/lucide/search";

import { useUserContext } from "@/contexts/UserContext";
import Input from "@/components/ui/Input";
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/Dropdown";
import { DropdownMenuTriggerProps } from "@kobalte/core/dropdown-menu";
import Button from "@/components/ui/Button";

const FilterOptionsDropdown: Component<{
  columnFilters: ColumnFiltersState;
  setColumnFilters: Setter<ColumnFiltersState>;
}> = (props) => {
  const user = useUserContext();

  const filterIsApplied = (id: "creator" | "isFavorited") =>
    props.columnFilters.some((filter) => filter.id === id);

  const applyFilter = (id: "creator" | "isFavorited", value: unknown) =>
    props.setColumnFilters((prev) => [...prev, { id, value }]);

  const removeFilter = (id: "creator" | "isFavorited") =>
    props.setColumnFilters((prev) => prev.filter((filter) => filter.id !== id));

  return (
    <Show when={user.info.isLoggedIn}>
      <Dropdown>
        <DropdownTrigger
          as={(props: DropdownMenuTriggerProps) => (
            <Button
              {...props}
              size="sm"
              class="h-12 w-40"
            >
              <FilterIcon />
              <span class="text-lg">Filters</span>
            </Button>
          )}
        />
        <DropdownContent class="p-3">
          <DropdownCheckboxItem
            checked={filterIsApplied("creator")}
            onChange={(checked) => {
              if (checked) {
                applyFilter("creator", checked ? user.info.name : "");
              } else {
                removeFilter("creator");
              }
            }}
          >
            My recipes
          </DropdownCheckboxItem>
          <DropdownCheckboxItem
            checked={filterIsApplied("isFavorited")}
            onChange={(checked) => {
              if (checked) {
                applyFilter("isFavorited", true);
              } else {
                removeFilter("isFavorited");
              }
            }}
          >
            My favorites
          </DropdownCheckboxItem>
        </DropdownContent>
      </Dropdown>
    </Show>
  );
};

const RecipeListHeader: Component<{
  columnFilters: ColumnFiltersState;
  setColumnFilters: Setter<ColumnFiltersState>;
}> = (props) => {
  return (
    <div class="flex gap-5">
      <FilterOptionsDropdown
        columnFilters={props.columnFilters}
        setColumnFilters={props.setColumnFilters}
      />

      <Input
        placeholder="Search recipes"
        value={
          (props.columnFilters.find((filter) => filter.id === "name")
            ?.value as string) ?? ""
        }
        onInput={(e) =>
          props.setColumnFilters((prev) =>
            prev
              .filter((filter) => filter.id !== "name")
              .concat({ id: "name", value: e.currentTarget.value }),
          )
        }
        leftSection={<SearchIcon />}
      />
    </div>
  );
};

export default RecipeListHeader;
