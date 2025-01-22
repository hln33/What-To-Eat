import { Component } from "solid-js";
import { Image } from "@kobalte/core/Image";

const RecipeListCard: Component = () => {
  return (
    <div class="flex flex-row-reverse justify-around gap-3 p-4">
      <div>
        <h3 class="text-xl">Fried Garlic</h3>
        <p>You have all ingredients</p>
      </div>
      <Image class="w-1/2">
        <Image.Img
          class="rounded-sm"
          src="https://www.seriouseats.com/thmb/5HVYf-rShl31VrW9ajM3uGMxWbM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__12__20201027-fried-garlic-microwave-vicky-wasik-14-f693c192393e406fa1737dbae8315e05.jpg"
          alt="Image of cooked dish"
        />
        <Image.Fallback>CD</Image.Fallback>
      </Image>
    </div>
  );
};

export default RecipeListCard;
