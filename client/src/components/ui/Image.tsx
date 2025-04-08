import { Component } from "solid-js";
import { Image as Kobalte } from "@kobalte/core/image";

import Skeleton from "./Skeleton";

const Image: Component<{
  class?: string;
  src: string;
  fallbackWidth: number;
  fallbackHeight: number;
}> = (props) => {
  return (
    <Kobalte
      class={props.class}
      fallbackDelay={0}
    >
      <Kobalte.Img src={props.src} />
      <Kobalte.Fallback>
        <Skeleton
          width={props.fallbackWidth}
          height={props.fallbackHeight}
        />
      </Kobalte.Fallback>
    </Kobalte>
  );
};

export default Image;
