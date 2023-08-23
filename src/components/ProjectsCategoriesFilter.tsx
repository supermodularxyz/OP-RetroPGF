import Link from "next/link";
import { Tag } from "~/components/ui/Tag";
import { type Filter } from "~/hooks/useFilter";
import {
  type ImpactCategory,
  impactCategoryLabels,
  useCategories,
} from "~/hooks/useProjects";

export const ProjectsCategoriesFilter = ({
  selected = [],
  onSelect,
}: {
  selected?: Filter["categories"];
  onSelect: (categories: Filter["categories"]) => void;
}) => {
  const categoriesCount = useCategories();
  return (
    <div className="flex gap-2 overflow-x-auto py-4 md:py-8">
      {Object.entries(impactCategoryLabels).map(([key, label]) => {
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
