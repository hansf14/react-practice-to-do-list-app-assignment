import { useRef } from "react";

export const useLikeConstructor = (constructor = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (!hasBeenCalled.current) {
    constructor();
    hasBeenCalled.current = true;
  }
  // Should not do something like `return;` or `return null;` here.
  // Otherwise the components that use this custom hook will be recreated (remounted) everytime,
  // instead of updating the component which might cause bugs like
  // recreating the `ref` with new values by the recent props given to the components.
};
