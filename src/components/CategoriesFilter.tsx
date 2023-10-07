import Link from "next/link";
import { type PropsWithChildren } from "react";
import { Tag } from "~/components/ui/Tag";
import {
  type ImpactCategory,
  impactCategoryLabels,
  categoryMap,
} from "~/hooks/useCategories";
import { type Filter } from "~/hooks/useFilter";

export const CategoriesFilter = ({
  count,
  selected = [],
  onSelect,
  children,
}: {
  count?: Record<string, number>;
  selected?: Filter["categories"];
  onSelect: (categories: Filter["categories"]) => void;
} & PropsWithChildren) => {
  return (
    <div className="my-2 flex gap-2 overflow-x-auto py-1">
      {children}
      {Object.entries(impactCategoryLabels).map(([key, label]) => {
        const category = key as ImpactCategory;
        const num = count?.[categoryMap[category]] ?? "?";
        return (
          <Tag
            as={count ? Link : undefined}
            scroll={false}
            disabled={!count}
            selected={selected.includes(category)}
            href={onSelect(
              selected.includes(category)
                ? selected.filter((c) => c !== key)
                : selected.concat(category)
            )}
            size="lg"
            key={key}
          >
            {label}
            <div className="rounded-lg bg-white px-2 py-1 text-xs font-bold">
              {num}
            </div>
          </Tag>
        );
      })}
    </div>
  );
};
