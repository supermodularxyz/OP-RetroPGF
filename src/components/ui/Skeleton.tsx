import { type ComponentProps } from "react";
import clsx from "clsx";

export const Skeleton = ({
  isLoading = false,
  className,
  children,
}: ComponentProps<"span"> & { isLoading?: boolean }) =>
  isLoading ? (
    <span
      className={clsx(
        "inline-flex h-4 min-w-[20px] animate-pulse bg-gray-200",
        className
      )}
    />
  ) : (
    <>{children}</>
  );
