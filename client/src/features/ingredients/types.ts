export type MeasurementSystem = "imperial" | "metric";

export type Ingredient = {
  amount: number;
  unit: IngredientUnit;
  name: string;
};

export type IngredientUnit = "g" | "kg" | "lb" | "oz";
