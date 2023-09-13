import { tv } from "tailwind-variants";
import { createComponent } from ".";

const chip = tv({
  base: "border rounded-full min-w-[42px] px-2 py-2 cursor-pointer inline-flex justify-center items-center whitespace-nowrap text-neutral-700 hover:text-neutral-900",
  variants: {},
});

export const Chip = createComponent("button", chip);
