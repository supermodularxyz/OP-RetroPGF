import { Tag } from "~/components/ui/Tag";
import { type Project } from "~/hooks/useProjects";

const impactCategoryLabels = {
  COLLECTIVE_GOVERNANCE: "Collective Governance",
} as const;

export const ProjectGridItem = ({ project }: { project: Project }) => {
  const category =
    impactCategoryLabels[
      project.impactCategory as keyof typeof impactCategoryLabels
    ];
  return (
    <div className=" rounded-[20px] border p-2">
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="space-y-2 px-4">
        <div className="-mt-8 h-16 w-16 rounded-lg border border-gray-200 bg-white p-1">
          <div className="flex h-full w-full rounded-md bg-gray-200" />
        </div>
        <h3 className="pt-2 text-lg font-bold">{project.displayName}</h3>
        <p className="text-sm text-neutral-700 line-clamp-2">{project.bio}</p>
        <Tag>{category}</Tag>
      </div>
    </div>
  );
};
