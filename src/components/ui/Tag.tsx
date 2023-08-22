import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tag = createComponent(
  "div",
  tv({
    base: "inline-flex w-fit rounded bg-gray-200 py-1 px-2 text-gray-700 text-xs",
  })
);
