import clsx from "clsx";
import { Tag } from "~/components/ui/Tag";
import { type Filter } from "~/hooks/useFilter";
import { impactCategoryLabels, type Project } from "~/hooks/useProjects";
import { createComponent } from "./ui";
import { tv } from "tailwind-variants";

type Props = { filter?: Filter; projects?: Project[] };

export const Projects = ({ filter, projects }: Props) => {
  const isList = filter?.display === "list";
  return (
    <div
      className={clsx("mb-8 grid gap-4", {
        ["md:grid-cols-3"]: !isList,
        ["gap-6 divide-y divide-neutral-200"]: isList,
      })}
    >
      {projects?.map((project) =>
        isList ? (
          <ProjectListItem key={project.id} project={project} />
        ) : (
          <ProjectGridItem key={project.id} project={project} />
        )
      )}
    </div>
  );
};

export const ProjectGridItem = ({ project }: { project: Project }) => {
  return (
    <div className="rounded-[20px] border p-2">
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="space-y-2 px-4 pb-2">
        <div className="-mt-8 pb-2">
          <ProjectImage />
        </div>
        <ProjectTitle>{project.displayName}</ProjectTitle>
        <p className="line-clamp-2 text-sm text-neutral-700">{project.bio}</p>
        <ImpactCategories tags={project.impactCategory} />
      </div>
    </div>
  );
};

export const ProjectListItem = ({ project }: { project: Project }) => {
  return (
    <div className="flex gap-6 pt-6">
      <ProjectImage />
      <div className="flex flex-1 flex-col gap-2">
        <ProjectTitle>{project.displayName}</ProjectTitle>
        <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
          {project.bio}
        </p>
        <ImpactCategories tags={project.impactCategory} />
      </div>
    </div>
  );
};

export const ProjectTitle = createComponent(
  "h3",
  tv({ base: "text-lg font-bold" })
);

export const ProjectImage = () => (
  <div className={"h-16 w-16 rounded-lg border border-gray-200 bg-white p-1"}>
    <div className="flex h-full w-full rounded-md bg-gray-200" />
  </div>
);

const ImpactCategories = ({ tags }: { tags: Project["impactCategory"] }) => (
  <div className="flex gap-1">
    {tags?.map((key) => {
      const category = impactCategoryLabels[key];
      return <Tag key={key}>{category}</Tag>;
    })}
  </div>
);
