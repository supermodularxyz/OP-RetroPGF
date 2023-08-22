import { Tag } from "~/components/ui/Tag";
import { type Project } from "~/hooks/useProjects";

const impactCategoryLabels = {
  COLLECTIVE_GOVERNANCE: "Collective Governance",
} as const;

export const ProjectListItem = ({ project }: { project: Project }) => {
  const category =
    impactCategoryLabels[
      project.impactCategory as keyof typeof impactCategoryLabels
    ];
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 h-16 w-16 rounded-lg border border-gray-200 bg-white p-1">
        <div className="flex h-full w-full rounded-md bg-gray-200" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{project.displayName}</h3>
        <p className="text-sm text-neutral-700 line-clamp-3 sm:line-clamp-2">{project.bio}</p>
        <Tag className="w-fit">{category}</Tag>
      </div>
    </div>
  );
};
