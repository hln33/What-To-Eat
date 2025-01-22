import { Component } from "solid-js";
import { Image } from "@kobalte/core/Image";

const RecipeListCard: Component<{
  name: string;
  requiredIngredients: Set<string>;
  providedIngredients: Set<string>;
}> = (props) => {
  const statusText = () => {
    const num_missing_ingredients = props.requiredIngredients.difference(
      props.providedIngredients,
    ).size;

    if (num_missing_ingredients === 0) {
      return "You have all ingredients";
    } else if (num_missing_ingredients === props.requiredIngredients.size) {
      return "You are missing all ingredients";
    } else {
      const is_plural = num_missing_ingredients > 1;
      return `You are missing ${num_missing_ingredients} ingredient${is_plural ? "s" : ""}`;
    }
  };

  return (
    <div class="flex flex-row-reverse gap-5 border p-4">
      <div class="flex basis-3/5 flex-col justify-between">
        <h3 class="text-xl">{props.name}</h3>
        <p class="">{statusText()}</p>
      </div>
      <Image class="size-1/2 flex-initial basis-2/5">
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
