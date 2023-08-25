import { type ImpactCategory, impactCategoryLabels } from "~/hooks/useCategories";
import { Tag } from "./Tag";

export const ImpactCategories = ({
  tags,
  type,
}: {
  tags: ImpactCategory[];
  type: "projects" | "lists";
}) => (
  <div className="flex gap-1">
    {tags?.length &&
      tags?.map((key) => {
        const category = impactCategoryLabels(type)[key];
        return <Tag key={key}>{category}</Tag>;
      })}
  </div>
);
