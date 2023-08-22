import { tv } from "tailwind-variants";
import { createComponent } from ".";

export const Divider = createComponent(
  "div",
  tv({
    base: "bg-gray-200",
    variants: {
      orientation: {
        vertical: "h-full w-[1px]",
        horizontal: "w-full h-[1px]",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  })
);
