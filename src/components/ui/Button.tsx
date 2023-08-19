import { tv } from "tailwind-variants";
import { createComponent } from ".";

const button = tv({
  base: "px-4 py-2 font-semibold transition-colors duration-150 whitespace-nowrap",
  variants: {
    color: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
    },
  },
});

export const Button = createComponent("button", button);
