import { tv } from "tailwind-variants";
import { createComponent } from ".";

const banner = tv({
  base: "rounded-xl p-4",
  variants: {
    variant: {
      warning: "bg-error-100 text-error-700",
      info: "bg-secondary-100 text-gray-900",
      success: "bg-success-200 text-success-600",
    },
  },
});

export const Banner = createComponent("div", banner);
