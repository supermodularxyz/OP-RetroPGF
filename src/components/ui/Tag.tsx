import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Tag = createComponent(
  "div",
  tv({
    base: "cursor-pointer inline-flex items-center justify-center gap-2 w-fit bg-gray-200 text-gray-700 whitespace-nowrap",
    variants: {
      size: {
        md: "rounded py-1 px-2 text-xs",
        lg: "rounded-xl p-2 text-lg",
      },
      selected: {
        true: "bg-gray-100",
      },
      disabled: {
        true: "opacity-50 cursor-default",
      },
    },
    defaultVariants: {
      size: "md",
    },
  })
);
