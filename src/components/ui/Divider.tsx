import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { createElement, type ComponentPropsWithoutRef } from "react";

const DividerComponent = createComponent(
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

export const Divider = ({
  icon,
  ...props
}: // eslint-disable-next-line
{ icon?: any } & ComponentPropsWithoutRef<typeof DividerComponent>) => (
  <div className="relative inline-flex w-full items-center justify-center">
    <DividerComponent {...props} />
    {icon ? (
      <div className="absolute left-1/2 mt-1 -translate-x-1/2 bg-white px-4 text-gray-200">
        {createElement(icon)}
      </div>
    ) : null}
  </div>
);
