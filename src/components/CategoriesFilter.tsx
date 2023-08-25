import Link from "next/link";
import { Tag } from "~/components/ui/Tag";
import { lists, projects } from "~/data/mock";
import {
  type ImpactCategory,
  impactCategoryLabels,
  useCategories,
} from "~/hooks/useCategories";
import { type Filter } from "~/hooks/useFilter";

export const CategoriesFilter = ({
  selected = [],
  onSelect,
  type,
}: {
  selected?: Filter["categories"];
  onSelect: (categories: Filter["categories"]) => void;
  type: "projects" | "lists";
}) => {
  const items = type == "projects" ? projects : lists;
  const categoriesCount = useCategories(items, type);
  return (
    <div className="flex gap-2 overflow-x-auto py-4 md:py-8">
      {Object.entries(impactCategoryLabels(type)).map(([key, label]) => {
        const category = key as ImpactCategory;
        const count = categoriesCount[category];
        return (
          <Tag
            as={count ? Link : undefined}
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
              {count}
            </div>
          </Tag>
        );
      })}
    </div>
  );
};
