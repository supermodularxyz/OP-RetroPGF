import { tv } from "tailwind-variants";
import { createComponent } from ".";

const button = tv({
  base: "px-4 py-2 font-semibold transition-colors rounded-xl duration-150 whitespace-nowrap disabled:bg-gray-200 disabled:text-gray-400 disabled:pointer-events-none disabled:pointer-default disabled:bg-gray-200",
  variants: {
    variant: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      ghost: "hover:bg-gray-100",
      outline: "border border-gray-300 hover:bg-gray-100",
      dark: "bg-gray-700 text-gray-100",
      default: "bg-gray-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const Button = createComponent("button", button);
