import { Accessor, Component, For } from "solid-js";
import StarIcon from "~icons/fe/star";

const MAX_RATING = 5;

const Rating: Component<{
  value: Accessor<number>;
  onChange: (newValue: number) => void;
}> = (props) => {
  return (
    <div aria-label={`Rating: ${props.value()} out of ${MAX_RATING} stars`}>
      <div class="flex h-10 cursor-pointer flex-row-reverse items-center justify-end">
        <For each={Array(MAX_RATING)}>
          {(_, index) => {
            const starValue = () => MAX_RATING - index();
            const isHighlighted = () => starValue() <= props.value();
            return (
              <StarIcon
                class={`${isHighlighted() ? "text-white" : "text-slate-500"} peer hover:size-6 hover:text-white peer-hover:text-white`}
                onClick={() => props.onChange(starValue())}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default Rating;
