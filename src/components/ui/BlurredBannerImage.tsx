import clsx from "clsx";
import { ComponentProps } from "react";

export const BlurredBannerImage = ({
  src = "",
  fallbackSrc = "",
  className,
  height,
}: {
  src?: string;
  fallbackSrc?: string;
  height?: string;
} & ComponentProps<"div">) => (
  <div className={clsx("overflow-hidden rounded-2xl", height)}>
    <div
      className={clsx("bg-gray-200 bg-cover bg-center", className, {
        ["blur-[40px]"]: !src,
      })}
      style={{
        backgroundImage: `url(${src ?? fallbackSrc})`,
      }}
    />
  </div>
);
