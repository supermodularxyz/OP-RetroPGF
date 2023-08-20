import { tv } from "tailwind-variants";
import { createComponent } from ".";

const button = tv({
  base: "px-4 py-2 font-semibold transition-colors rounded-xl duration-150 whitespace-nowrap disabled:bg-gray-200 disabled:text-gray-400",
  variants: {
    variant: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      ghost: "hover:bg-black/10",
    },
  },
});

export const Button = createComponent("button", button);
