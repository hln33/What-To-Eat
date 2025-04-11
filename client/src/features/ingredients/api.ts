import { api, callRPC } from "@/api";

export const getAllIngredientNames = async (): Promise<{ name: string }[]> => {
  const res = await callRPC(api.ingredients.all.$get());
  return res;
};
