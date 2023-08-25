import clsx from "clsx";
import { Tag } from "~/components/ui/Tag";
import { type Filter } from "~/hooks/useFilter";
import { type Project } from "~/hooks/useProjects";
import { Card, CardTitle } from "~/components/ui/Card";
import { ProjectImage } from "./ui/ProjectImage";
import { ImpactCategories } from "./ui/ImpactCategories";
import { Grid } from "./Grid";

type Props = { filter?: Filter; projects?: Project[] };

export const Projects = ({ filter, projects }: Props) => {
  const isList = filter?.display === "list";
  return (
    <Grid isList={isList}>
      {projects?.map((project) =>
        isList ? (
          <ProjectListItem key={project.id} project={project} />
        ) : (
          <ProjectGridItem key={project.id} project={project} />
        )
      )}
    </Grid>
  );
};

export const ProjectGridItem = ({ project }: { project: Project }) => {
  return (
    <Card>
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="space-y-2 px-4 pb-2">
        <div className="-mt-8 pb-2">
          <ProjectImage />
        </div>
        <CardTitle>{project.displayName}</CardTitle>
        <p className="line-clamp-2 text-sm text-neutral-700">{project.bio}</p>
        <ImpactCategories tags={project.impactCategory} type={"projects"} />
      </div>
    </Card>
  );
};

export const ProjectListItem = ({ project }: { project: Project }) => {
  return (
    <div className="flex  cursor-pointer gap-6 pt-6">
      <ProjectImage />
      <div className="flex flex-1 flex-col gap-2">
        <CardTitle>{project.displayName}</CardTitle>
        <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
          {project.bio}
        </p>
        <ImpactCategories tags={project.impactCategory} type={"projects"} />
      </div>
    </div>
  );
};
