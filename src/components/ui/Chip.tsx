import { tv } from "tailwind-variants";
import { createComponent } from ".";

const chip = tv({
  base: "border rounded-full px-4 py-2",
  variants: {},
});

export const Chip = createComponent("div", chip);
