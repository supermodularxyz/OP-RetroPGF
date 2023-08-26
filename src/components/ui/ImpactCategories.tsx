import {
  type ImpactCategory,
  impactCategoryLabels,
} from "~/hooks/useCategories";
import { Tag } from "./Tag";

export const ImpactCategories = ({ tags }: { tags: ImpactCategory[] }) => (
  <div className="flex gap-1">
    {tags?.length &&
      tags?.map((key) => {
        const category = impactCategoryLabels[key];
        return <Tag key={key}>{category}</Tag>;
      })}
  </div>
);
