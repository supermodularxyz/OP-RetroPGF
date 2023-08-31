import { type Filter } from "~/hooks/useFilter";
import { type Project } from "~/hooks/useProjects";
import { type List } from "~/hooks/useLists";
import { Card, CardTitle } from "./ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import { Divider } from "./ui/Divider";
import { Like, Liked } from "~/components/icons";
import { IconButton } from "./ui/Button";
import clsx from "clsx";
import { Avatar, AvatarWithBorder } from "./ui/Avatar";
import Link from "next/link";

type Props = { filter?: Filter; lists?: List[] };

export const Lists = ({ filter, lists }: Props) => {
  const isList = filter?.display === "list";
  return (
    <div
      className={clsx("mb-8 grid gap-4", {
        ["md:grid-cols-3"]: !isList,
        ["gap-6 divide-y divide-neutral-200"]: isList,
      })}
    >
      {lists?.map((list) => (
        <Link href={`/lists/${list.id}`} key={list.id}>
          {isList ? <ListListItem list={list} /> : <ListGridItem list={list} />}
        </Link>
      ))}
    </div>
  );
};

export const ListGridItem = ({ list }: { list: List }) => {
  return (
    <Card>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{list.displayName}</CardTitle>
            <AvatarWithName name={list.creatorName} />
          </div>
          <LikesNumber likesNumber={list.likesNumber} />
        </div>

        <ProjectsLogosCard projects={list.projects} />

        <p className="line-clamp-2 text-sm text-neutral-700">{list.bio}</p>

        <ImpactCategories tags={list.impactCategory} />
      </div>
    </Card>
  );
};

export const ListListItem = ({
  list,
  allocation,
}: {
  allocation?: string;
  list: List;
}) => {
  return (
    <div className="cursor-pointer space-y-3 pt-6 first:pt-0">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{list.displayName}</CardTitle>
            <Divider orientation={"vertical"} />
            <LikesNumber likesNumber={list.likesNumber} />
          </div>
          <div className="font-semibold">{allocation}</div>
        </div>
        <AvatarWithName name={list.creatorName} />
      </div>
      <ProjectsLogosCard projects={list.projects} />

      <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
        {list.bio}
      </p>

      <ImpactCategories tags={list.impactCategory} />
    </div>
  );
};

export const LikesNumber = ({
  likesNumber,
  isLiked,
}: {
  likesNumber: number;
  isLiked?: boolean;
}) => (
  <div className="flex items-center gap-1">
    <span className="text-xs">{likesNumber}</span>
    <IconButton icon={isLiked ? Liked : Like} variant={"ghost"} />
  </div>
);

export const AvatarWithName = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2">
    <Avatar size="xs" rounded="full" />
    <p className="text-sm font-semibold">{name} </p>
  </div>
);

export const ProjectsLogosCard = ({ projects }: { projects: Project[] }) => (
  <div className="flex items-center gap-3">
    <div className="ml-1 flex">
      {projects?.slice(0, 4).map((project) => (
        <AvatarWithBorder key={project.id} className="-mx-1" size="sm" />
      ))}
    </div>
    {projects.length > 4 && (
      <p className="text-xs text-neutral-600">
        +{projects.length - 4} projects
      </p>
    )}
  </div>
);
