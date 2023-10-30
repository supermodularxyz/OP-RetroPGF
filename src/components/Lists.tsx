import clsx from "clsx";
import Link from "next/link";
import { Address, useAccount, useEnsAvatar, useEnsName } from "wagmi";

import { type Filter } from "~/hooks/useFilter";
import { useProject } from "~/hooks/useProjects";
import { type List, useLikes } from "~/hooks/useLists";
import { Card, CardTitle } from "./ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import { Divider } from "./ui/Divider";
import { Like, Liked } from "~/components/icons";
import { Avatar, AvatarWithBorder } from "./ui/Avatar";
import { truncate } from "~/utils/truncate";
import { Skeleton } from "./ui/Skeleton";

type Props = { filter?: Filter; lists?: List[]; isLoading: boolean };

export const Lists = ({ filter, lists, isLoading }: Props) => {
  const isList = filter?.display === "list";
  return (
    <>
      <div
        className={clsx("mb-8 flex flex-col gap-4 md:grid", {
          ["md:grid-cols-2 lg:grid-cols-3"]: !isList,
          ["gap-6 divide-y divide-neutral-200"]: isList,
        })}
      >
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) =>
              isList ? (
                <ListListItem key={i} isLoading />
              ) : (
                <ListGridItem key={i} isLoading />
              )
            )
          : lists?.map((list) => (
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
    </>
  );
};

export const ListGridItem = ({
  list,
  isLoading,
}: {
  list?: List;
  isLoading?: boolean;
}) => {
  return (
    <Card className={clsx("h-full", { ["animate-pulse"]: isLoading })}>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Skeleton isLoading={isLoading} className="w-[140px]">
                {list?.listName}
              </Skeleton>
            </CardTitle>
            <Skeleton isLoading={isLoading} className="w-full">
              <AvatarWithName address={list?.author?.address} />
            </Skeleton>
          </div>
          <LikeCount listId={list?.id} />
        </div>

        <ProjectsLogosCard projects={list?.listContent} />

        <p className="line-clamp-2 text-sm text-neutral-700">
          <Skeleton isLoading={isLoading} className="w-full">
            {list?.listDescription}
          </Skeleton>
        </p>

        <Skeleton isLoading={isLoading} className="w-[100px]">
          <ImpactCategories tags={list?.categories} />
        </Skeleton>
      </div>
    </Card>
  );
};

export const ListListItem = ({
  list,
  allocation,
  isLoading,
}: {
  allocation?: string;
  list?: List;
  isLoading?: boolean;
}) => {
  return (
    <div className="cursor-pointer space-y-3">
      <div>
        <div className="items-center justify-between md:flex">
          <div className="flex items-center gap-2">
            <CardTitle>
              <Skeleton isLoading={isLoading} className="w-[140px]">
                {list?.listName}
              </Skeleton>
            </CardTitle>
            <Divider orientation={"vertical"} />
            <LikeCount listId={list?.id} />
          </div>
          <div className="text-sm font-semibold md:text-base">{allocation}</div>
        </div>
        <Skeleton isLoading={isLoading} className="w-full">
          <AvatarWithName address={list?.author?.address} />
        </Skeleton>
      </div>
      <ProjectsLogosCard projects={list?.listContent} />

      <p className="line-clamp-3 text-sm text-neutral-700 sm:line-clamp-2">
        <Skeleton isLoading={isLoading} className="w-full">
          {list?.listDescription}
        </Skeleton>
      </p>

      <Skeleton isLoading={isLoading} className="w-[100px]">
        <ImpactCategories tags={list?.categories} />
      </Skeleton>
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

export const AvatarWithName = ({ address }: { address?: Address }) => {
  const ens = useEnsName({ address, chainId: 1, enabled: Boolean(address) });
  const name = ens.data;
  const avatar = useEnsAvatar({ name, chainId: 1, enabled: Boolean(name) });
  const avatarSrc =
    avatar.data ?? `https://source.boringavatars.com/marble/16/${address}`;
  return (
    <div className="flex items-center gap-2">
      <Avatar src={avatarSrc} size="xs" rounded="full" />
      <p className="text-sm font-semibold">{name ?? truncate(address, 13)} </p>
    </div>
  );
};

export const ProjectsLogosCard = ({
  projects,
}: {
  projects?: List["listContent"];
}) => (
  <div className="flex items-center gap-3">
    <div className="ml-1 flex">
      {projects?.slice(0, 4).map((item) => (
        <ProjectAvatar key={item.project?.id} id={item.project?.id} />
      ))}
    </div>
    {(projects?.length ?? 0) > 4 && (
      <p className="text-xs text-neutral-600">
        +{(projects?.length ?? 0) - 4} projects
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
