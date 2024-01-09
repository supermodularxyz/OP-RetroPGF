import clsx from "clsx";
import Link from "next/link";
import { type Filter } from "~/hooks/useFilter";
import { type Project } from "~/hooks/useProjects";
import { Card, CardTitle } from "~/components/ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import { AvatarWithBorder } from "./ui/Avatar";
import { Skeleton } from "./ui/Skeleton";
import { BlurredBannerImage } from "./ui/BlurredBannerImage";
import { ProjectRewardButton } from "./ProjectRewardButton";

type Props = { filter?: Filter; projects?: Project[]; isLoading?: boolean };

export const Projects = ({ filter, projects, isLoading }: Props) => {
  const isList = filter?.display === "list";

  return (
    <div
      className={clsx("mb-8 flex flex-col gap-4 md:grid", {
        ["md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"]: !isList,
        ["gap-6 divide-y divide-neutral-200"]: isList,
      })}
    >
      {isLoading
        ? Array.from({ length: 12 }).map((_, i) =>
            isList ? (
              <ProjectListItem key={i} isLoading />
            ) : (
              <ProjectGridItem key={i} isLoading />
            )
          )
        : projects?.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              target="_blank"
              key={project.id}
            >
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

export const ProjectGridItem = ({
  project,
  isLoading,
}: {
  project?: Project;
  isLoading?: boolean;
}) => {
  console.log("project", project);
  const { bannerImageUrl, profileImageUrl } = project?.profile ?? {};
  return (
    <Card
      className={clsx("group flex h-full flex-col", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <BlurredBannerImage
        className="h-24 opacity-50 transition-opacity group-hover:opacity-100"
        src={bannerImageUrl}
        fallbackSrc={profileImageUrl}
      />
      <div className="relative z-10 flex-1 space-y-2 px-4 pb-2">
        <div className="-mt-8 pb-2">
          <AvatarWithBorder
            className="origin-left transition group-hover:scale-75"
            src={profileImageUrl}
          />
        </div>
        <div className="transition-transform group-hover:-translate-y-4">
          <CardTitle>
            <Skeleton isLoading={isLoading} className="w-[140px]">
              {project?.displayName}
            </Skeleton>
          </CardTitle>
          <p className="line-clamp-2 text-sm text-neutral-700">
            <Skeleton isLoading={isLoading} className="h-[40px] w-full">
              {project?.bio}
            </Skeleton>
          </p>
        </div>
        <Skeleton isLoading={isLoading} className="w-[100px]">
          <ImpactCategories tags={project?.impactCategory} />
        </Skeleton>
      </div>
      <ProjectRewardButton amount={project?.awarded} />
    </Card>
  );
};

export const ProjectListItem = ({
  project,
  isLoading,
}: {
  project?: Project;
  isLoading?: boolean;
}) => {
  return (
    <div className="group flex cursor-pointer justify-between pt-6">
      <div className="flex gap-6">
        <AvatarWithBorder src={project?.profile?.profileImageUrl} />
        <div className="min-w-0 space-y-2">
          <Skeleton isLoading={isLoading} className="w-[140px]">
            {project?.displayName}
          </Skeleton>
          <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
            <Skeleton isLoading={isLoading} className="w-1/2">
              {project?.bio}
            </Skeleton>
          </p>
          <Skeleton isLoading={isLoading} className="w-[100px]">
            <ImpactCategories tags={project?.impactCategory} />
          </Skeleton>
        </div>
      </div>
      <div className="w-48">
        <ProjectRewardButton amount={project?.awarded} />
      </div>
    </div>
  );
};
