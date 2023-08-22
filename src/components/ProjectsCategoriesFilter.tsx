import Link from "next/link";
import { Tag } from "~/components/ui/Tag";
import { type Filter } from "~/hooks/useFilter";
import { type ImpactCategory, impactCategoryLabels } from "~/hooks/useProjects";

export const ProjectsCategoriesFilter = ({
  selected = [],
  onSelect,
}: {
  selected?: Filter["categories"];
  onSelect: (categories: Filter["categories"]) => void;
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-4 md:py-8">
      {Object.entries(impactCategoryLabels).map(([key, label]) => {
        const category = key as ImpactCategory;
        return (
          <Tag
            as={Link}
            selected={selected.includes(category)}
            href={onSelect(
              selected.includes(category)
                ? selected.filter((c) => c !== key)
                : selected.concat(category)
            )}
            className="cursor-pointer hover:bg-gray-300"
            size="lg"
            key={key}
          >
            {label}
            <div className="rounded-lg bg-white p-1 text-xs font-bold">168</div>
          </Tag>
        );
      })}
    </div>
  );
};
