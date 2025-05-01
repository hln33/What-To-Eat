import { Component, Show } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";

import {
  createAddUserIngredientsMutation,
  createUserIngredientsQuery,
  userKeys,
} from "@/features/users/queries";
import { useUserContext } from "@/contexts/UserContext";
import MultiSelect from "@/components/ui/MultiSelect";
import { createIngredientNamesQuery } from "../queries";

const UserIngredientsInput: Component = () => {
  const user = useUserContext();
  const queryClient = useQueryClient();

  const ingredientsQuery = createIngredientNamesQuery();
  const userIngredientsQuery = createUserIngredientsQuery();
  const addUserIngredientsMutation = createAddUserIngredientsMutation({
    invalidate: false,
  });

  let timeoutId: number | undefined;
  const debounce = (callback: () => void) => {
    const DEBOUNCE_DELAY_MS = 5000;

    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, DEBOUNCE_DELAY_MS);
  };

  const handleIngredientsChange = (ingredients: string[]) => {
    debounce(() => {
      if (user.info.isLoggedIn === false) {
        console.error(
          "cannot save ingredients for a user that is not logged in.",
        );
        return;
      }
      addUserIngredientsMutation.mutate({
        userId: user.info.id,
        ingredientNames: ingredients,
      });
    });

    /**
     * Directly set query data to allow UI to instantly reflect newly added ingredients.
     * The mutation is only used to save the user's ingredients in the background.
     */
    queryClient.setQueryData(
      userKeys.ingredientsList(user.info.id ?? ""),
      ingredients,
    );
  };

  return (
    <Show when={userIngredientsQuery.data}>
      {(userIngredients) => (
        <MultiSelect
          label="Your Ingredients"
          placeholder="Pick or type ingredients"
          options={ingredientsQuery.data ?? []}
          defaultValue={userIngredients()}
          onChange={handleIngredientsChange}
        />
      )}
    </Show>
  );
};

export default UserIngredientsInput;
