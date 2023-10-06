import { type Filter } from "~/hooks/useFilter";
import { useProject } from "~/hooks/useProjects";
import { type List, useLikes } from "~/hooks/useLists";
import { Card, CardTitle } from "./ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import { Divider } from "./ui/Divider";
import { Like, Liked } from "~/components/icons";
import clsx from "clsx";
import { Avatar, AvatarWithBorder } from "./ui/Avatar";
import Link from "next/link";
import { useAccount } from "wagmi";
import { type Allocation } from "~/hooks/useBallot";
import { useProfile } from "~/hooks/useProfiles";

type Props = { filter?: Filter; lists?: List[] };

export const Lists = ({ filter, lists }: Props) => {
  const isList = filter?.display === "list";

  return (
    <>
      {!lists ? null : (
        <div
          className={clsx("mb-8 flex flex-col gap-4 md:grid", {
            ["md:grid-cols-2 lg:grid-cols-3"]: !isList,
            ["gap-6 divide-y divide-neutral-200"]: isList,
          })}
        >
          {lists?.map((list) => (
            <Link
              href={`/lists/${list.id}`}
              key={list.id}
              className={clsx({
                ["pt-6 first:pt-0"]: isList,
              })}
            >
              {isList ? (
                <ListListItem list={list} />
              ) : (
                <ListGridItem list={list} />
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export const ListGridItem = ({ list }: { list: List }) => {
  return (
    <Card>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{list.displayName}</CardTitle>
            <AvatarWithName name={list.displayName} owner={list.owner} />
          </div>
          <LikeCount listId={list.id} />
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
    <div className="cursor-pointer space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{list.displayName}</CardTitle>
            <Divider orientation={"vertical"} />
            <LikeCount listId={list.id} />
          </div>
          <div className="font-semibold">{allocation}</div>
        </div>
        <AvatarWithName name={list.displayName} owner={list?.owner} />
      </div>
      <ProjectsLogosCard projects={list.projects} />

      <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
        {list.bio}
      </p>

      <ImpactCategories tags={list.impactCategory} />
    </div>
  );
};

export const LikeCount = ({ listId = "" }) => {
  const { address } = useAccount();
  const { data: likes } = useLikes(listId);
  const isLiked = () => !!(address && likes?.includes(address));

  return (
    <div className="flex">
      <span className="text-xs">{likes?.length ?? 0}</span>
      {isLiked() ? (
        <Liked className="ml-2 h-4 w-4 text-primary-600" />
      ) : (
        <Like className="ml-2 h-4 w-4" />
      )}
    </div>
  );
};

export const AvatarWithName = ({
  name,
  owner,
}: {
  name: string;
  owner?: string;
}) => {
  const { data: profile } = useProfile(owner);
  return (
    <div className="flex items-center gap-2">
      <Avatar src={profile?.profileImageUrl} size="xs" rounded="full" />
      <p className="text-sm font-semibold">{name} </p>
    </div>
  );
};

export const ProjectsLogosCard = ({ projects }: { projects: Allocation[] }) => (
  <div className="flex items-center gap-3">
    <div className="ml-1 flex">
      {projects?.slice(0, 4).map((project) => (
        <ProjectAvatar key={project.id} id={project.id} />
      ))}
    </div>
    {projects.length > 4 && (
      <p className="text-xs text-neutral-600">
        +{projects.length - 4} projects
      </p>
    )}
  </div>
);

const ProjectAvatar = ({ id }: { id: string }) => {
  const { data: project } = useProject(id);

  return (
    <AvatarWithBorder
      src={project?.profile?.profileImageUrl}
      className="-mx-1"
      size="sm"
    />
  );
};
