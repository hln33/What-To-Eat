export type RecipeTableData = Recipe & { status: string };

export type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
};
