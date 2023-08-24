import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const CardTitle = createComponent(
  "h3",
  tv({
    base: "text-lg font-bold",
  })
);
