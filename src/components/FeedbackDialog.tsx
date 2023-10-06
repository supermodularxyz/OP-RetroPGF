import {
  createElement,
  type FunctionComponent,
  type ComponentPropsWithoutRef,
} from "react";
import { Banner } from "./ui/Banner";

export const FeedbackDialog = ({
  icon,
  variant,
  children,
}: ComponentPropsWithoutRef<"div"> & {
  variant: "success" | "info";
  icon: FunctionComponent<{ className: string }>;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Banner variant={variant}>
        {createElement(icon, { className: "w-8 h-8" })}
      </Banner>
      {children}
    </div>
  );
};
