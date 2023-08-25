import clsx from "clsx";
import { type PropsWithChildren } from "react";

export const Grid = ({
  isList,
  children,
}: { isList: boolean } & PropsWithChildren) => {
  return (
    <div
      className={clsx("mb-8 grid gap-4", {
        ["md:grid-cols-3"]: !isList,
        ["gap-6 divide-y divide-neutral-200"]: isList,
      })}
    >
      {children}
    </div>
  );
};
