import { tv } from "tailwind-variants";
import { createComponent } from ".";
import { type ComponentProps, createElement } from "react";
import { type IconType } from "react-icons";

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

export const BannerComponent = createComponent("div", banner);

export const Banner = ({
  icon,
  title,
  children,
  ...props
}: { icon?: IconType } & ComponentProps<typeof BannerComponent>) => {
  return (
    <BannerComponent {...props}>
      <div className="flex gap-2">
        {icon ? createElement(icon, { className: "w-4 h-4" }) : null}
        <div className="font-semibold">{title}</div>
      </div>
      {children}
    </BannerComponent>
  );
};
