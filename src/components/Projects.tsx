import clsx from "clsx";
import { type Filter } from "~/hooks/useFilter";
import { type Project } from "~/hooks/useProjects";
import { Card, CardTitle } from "~/components/ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import Link from "next/link";
import { AvatarWithBorder } from "./ui/Avatar";

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
      {projects?.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          {isList ? (
            <ProjectListItem project={project} />
          ) : (
            <ProjectGridItem project={project} />
          )}
        </Link>
      ))}
    </div>
  );
};

export const ProjectGridItem = ({ project }: { project: Project }) => {
  return (
    <Card>
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="space-y-2 px-4 pb-2">
        <div className="-mt-8 pb-2">
          <AvatarWithBorder />
        </div>
        <CardTitle>{project.displayName}</CardTitle>
        <p className="line-clamp-2 text-sm text-neutral-700">{project.bio}</p>
        <ImpactCategories tags={project.impactCategory} />
      </div>
    </Card>
  );
};

export const ProjectListItem = ({ project }: { project: Project }) => {
  return (
    <div className="flex  cursor-pointer gap-6 pt-6">
      <div>
        <AvatarWithBorder />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <CardTitle>{project.displayName}</CardTitle>
        <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
          {project.bio}
        </p>
        <ImpactCategories tags={project.impactCategory} />
      </div>
    </div>
  );
};
