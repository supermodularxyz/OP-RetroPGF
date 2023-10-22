import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentPropsWithRef, createElement } from "react";
import clsx from "clsx";

export const Image = ({
  src,
  className,
  ...props
}: ComponentPropsWithRef<"img">) => {
  return createElement("div", {
    ...props,
    style: {
      backgroundImage: `url(${src})`,
    },
    className: clsx("bg-cover", className),
  });
};

export const Avatar = createComponent(
  Image,
  tv({
    base: "bg-gray-200 border border-gray-200",
    variants: {
      size: {
        xs: "w-5 h-5 rounded-xs",
        sm: "w-12 h-12 rounded-md",
        md: "w-16 h-16 rounded-md",
        lg: "w-40 h-40 rounded-3xl",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  })
);

const AvatarBorder = createComponent(
  Image,
  tv({
    base: "inline-flex border border-gray-200 bg-white flex-shrink-0",
    variants: {
      size: {
        sm: "rounded-md p-0.5 h-8 w-8",
        md: "rounded-lg p-1 h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  })
);

export const AvatarWithBorder = (
  props: ComponentPropsWithRef<typeof Avatar>
) => (
  <AvatarBorder {...props}>
    <div className="h-full w-full rounded bg-gray-200" />
  </AvatarBorder>
);
