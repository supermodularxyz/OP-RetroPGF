import Link from "next/link";
import { type PropsWithChildren } from "react";
import { Tag } from "~/components/ui/Tag";
import {
  type ImpactCategory,
  impactCategoryLabels,
  categoryMap,
  useCategories,
} from "~/hooks/useCategories";
import { type Filter } from "~/hooks/useFilter";

const { PAIRWISE, ...labels } = impactCategoryLabels;
const categoryLabels = {
  lists: impactCategoryLabels,
  projects: labels,
};

export const CategoriesFilter = ({
  selected = [],
  type,
  onSelect,
  children,
}: {
  selected?: Filter["categories"];
  type: "projects" | "lists";
  onSelect: (categories: Filter["categories"]) => void;
} & PropsWithChildren) => {
  const { data } = useCategories();
  const count = data?.[type];

  return (
    <div className="my-2 flex gap-2 overflow-x-auto py-1">
      {children}
      {Object.entries(categoryLabels[type]).map(([key, label]) => {
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
