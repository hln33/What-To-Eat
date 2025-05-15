import { Component, createSignal } from "solid-js";
import { createQuery, useQueryClient } from "@tanstack/solid-query";

import {
  createAddUserIngredientsMutation,
  userQueries,
} from "@/features/users/queries";
import { useUserContext } from "@/contexts/UserContext";
import MultiSelect from "@/components/ui/MultiSelect";
import { ingredientQueries } from "../queries";

const createDebouncedFunction = (callback: () => void) => {
  const DEBOUNCE_DELAY_MS = 5000;
  let timeoutId: number | undefined;
  return () => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(callback, DEBOUNCE_DELAY_MS);
  };
};

const UserIngredientsInput: Component<{ initialUserIngredients: string[] }> = (
  props,
) => {
  const queryClient = useQueryClient();
  const user = useUserContext();

  const [selectedIngredients, setSelectedIngredients] = createSignal(
    props.initialUserIngredients,
  );

  const ingredientsQuery = createQuery(() => ingredientQueries.all);
  const addUserIngredientsMutation = createAddUserIngredientsMutation();

  const debouncedSaveIngredients = createDebouncedFunction(() => {
    if (user.info.isLoggedIn === true) {
      addUserIngredientsMutation.mutate({
        userId: user.info.id,
        ingredientNames: selectedIngredients(),
      });
    }
  });

  const handleIngredientsChange = (ingredients: string[]) => {
    setSelectedIngredients(ingredients);

    if (user.info.isLoggedIn) {
      /**
       * Debounce the saving of user ingredients to avoid excessive API calls.
       */
      debouncedSaveIngredients();
      /**
       * Directly set query data to allow UI to instantly reflect newly added ingredients.
       * The prior mutation is only used to save the user's ingredients in the background.
       */
      queryClient.setQueryData(
        userQueries.ingredientsList(user.info).queryKey,
        ingredients,
      );
    } else {
      console.warn("cannot save ingredients for a user that is not logged in.");
    }
  };

  return (
    <MultiSelect
      label="Your ingredients"
      placeholder="Pick or type ingredients"
      options={ingredientsQuery.data ?? []}
      defaultValue={props.initialUserIngredients}
      values={selectedIngredients()}
      onChange={handleIngredientsChange}
    />
  );
};

export default UserIngredientsInput;
