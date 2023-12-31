import {
  type ImpactCategory,
  impactCategoryLabels,
} from "~/hooks/useCategories";
import { Tag } from "./ui/Tag";

export const ImpactCategories = ({ tags }: { tags?: ImpactCategory[] }) => (
  <div className="no-scrollbar">
    <div className="flex gap-1 overflow-x-auto">
      {tags?.map((key) => (
        <Tag key={key} size="sm">
          {impactCategoryLabels[key]}
        </Tag>
      ))}
    </div>
  </div>
);
