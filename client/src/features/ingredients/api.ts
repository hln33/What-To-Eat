import { api, callRPC } from "@/api";
import { Ingredient } from "./types";

export const getAllIngredients = async (): Promise<Ingredient[]> => {
  const res = await callRPC(api.ingredients.all.$get());
  return res;
};
