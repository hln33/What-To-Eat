import { Component } from "solid-js";
import RecipeListCard from "./RecipeListCard";

const RecipeList: Component = () => {
  return (
    <div class="border">
      <h2 class="mb-5 text-4xl">recipe list</h2>

      <RecipeListCard />
    </div>
  );
};

export default RecipeList;
