import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentPropsWithRef, createElement, forwardRef } from "react";

const button = tv({
  base: "inline-flex items-center justify-center font-semibold text-center transition-colors rounded-xl duration-150 whitespace-nowrap disabled:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  variants: {
    variant: {
      primary: "bg-primary-600 hover:bg-primary-700 text-white",
      ghost: "hover:bg-gray-100",
      outline: "border border-gray-300 hover:bg-gray-100 disabled:border-none",
      dark: "bg-gray-700 text-gray-100",
      default: "bg-gray-100",
      link: "bg-none hover:underline",
    },
    size: {
      sm: "px-3 py-2 h-10 min-w-[40px]",
      deafult: "px-4 py-2 h-12",
      icon: "h-12 w-12",
    },
    disabled: {
      true: "text-gray-400 pointer-events-none pointer-default bg-gray-200 border-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "deafult",
  },
});

export const Button = createComponent("button", button);

export const IconButton = forwardRef(function IconButton(
  {
    children,
    icon,
    size,
    ...props
  }: // eslint-disable-next-line
  { icon: any; size?: string } & ComponentPropsWithRef<typeof Button>,
  ref
) {
  return (
    <Button ref={ref} {...props} size={children ? size : "icon"}>
      {createElement(icon, { className: `w-4 h-4 ${children ? "mr-2" : ""}` })}
      {children}
    </Button>
  );
});
