import { Component } from "solid-js";
import { Image } from "@kobalte/core/Image";
import { A } from "@solidjs/router";

const RecipeListCard: Component<{
  id: number;
  name: string;
  requiredIngredients: Set<string>;
  providedIngredients: Set<string>;
}> = (props) => {
  const statusText = () => {
    const numMissingIngredients = props.requiredIngredients.difference(
      props.providedIngredients,
    ).size;

    if (numMissingIngredients === 0) {
      return "You have all ingredients";
    } else if (numMissingIngredients === props.requiredIngredients.size) {
      return "You are missing all ingredients";
    } else {
      const isPlural = numMissingIngredients > 1;
      return `You are missing ${numMissingIngredients} ingredient${isPlural ? "s" : ""}`;
    }
  };

  return (
    <A
      href={`/recipe/${props.id}`}
      class="flex flex-row-reverse gap-6 rounded-md border border-slate-600 bg-slate-900 p-3"
    >
      <div class="flex basis-2/3 flex-col justify-between">
        <h3 class="text-lg font-bold">{props.name}</h3>
        <p
          class="text-sm"
          role="note"
          aria-live="polite"
        >
          {statusText()}
        </p>
      </div>
      <Image class="basis-1/3">
        <Image.Img
          class="rounded-sm"
          src="https://www.seriouseats.com/thmb/5HVYf-rShl31VrW9ajM3uGMxWbM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__12__20201027-fried-garlic-microwave-vicky-wasik-14-f693c192393e406fa1737dbae8315e05.jpg"
          alt="Image of cooked dish"
        />
        <Image.Fallback>CD</Image.Fallback>
      </Image>
    </A>
  );
};

export default RecipeListCard;
