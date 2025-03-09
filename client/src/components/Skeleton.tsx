import { Component } from "solid-js";
import { Skeleton as KobalteSkeleton } from "@kobalte/core/skeleton";

const Skeleton: Component<{ class?: string; height: number }> = (props) => {
  return (
    <KobalteSkeleton
      class={`animate-skeleton-fade rounded bg-gray-400 ${props.class}`}
      height={props.height}
    />
  );
};

export default Skeleton;
