import { Component } from "solid-js";
import { Skeleton as KobalteSkeleton } from "@kobalte/core/skeleton";

const Skeleton: Component<{ height: number; width?: number }> = (props) => {
  return (
    <KobalteSkeleton
      class="animate-skeleton-fade rounded bg-gray-400"
      height={props.height}
      width={props.width}
    />
  );
};

export default Skeleton;
