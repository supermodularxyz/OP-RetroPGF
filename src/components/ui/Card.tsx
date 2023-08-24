import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Card = createComponent(
  "div",
  tv({
    base: "rounded-[20px] border p-2",
  })
);

