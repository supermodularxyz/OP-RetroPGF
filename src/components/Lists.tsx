import { type Filter } from "~/hooks/useFilter";
import { type Project } from "~/hooks/useProjects";
import { useLikeList, type List, useAllListsLikes } from "~/hooks/useLists";
import { Card, CardTitle } from "./ui/Card";
import { ImpactCategories } from "./ImpactCategories";
import { Divider } from "./ui/Divider";
import { Like, Liked } from "~/components/icons";
import { Button } from "./ui/Button";
import clsx from "clsx";
import { Avatar, AvatarWithBorder } from "./ui/Avatar";
import Link from "next/link";
import { useAccount } from "wagmi";

type Props = { filter?: Filter; lists?: List[] };

export const Lists = ({ filter, lists }: Props) => {
  const isList = filter?.display === "list";

  const { data: likes } = useAllListsLikes();
  const like = useLikeList();
  const { address } = useAccount();

  const isLiked = (id: string) =>
    !!address && listLikesByListId(id)?.includes(address);

  const listLikesByListId = (id: string) => {
    if (!likes) return;
    return likes.likes[id];
  };

  const handleLikeClick = (id: string) => {
    if (!isLiked(id)) {
      like.mutate(id);
      window.alert("handle like");
    } else {
      window.alert("handle undo like");
      // TODO: add toggle like
    }
  };

  return (
    <div
      className={clsx("mb-8 grid gap-4", {
        ["md:grid-cols-3"]: !isList,
        ["gap-6 divide-y divide-neutral-200"]: isList,
      })}
    >
      {lists?.map((list) => (
        <Link href={`/lists/${list.id}`} key={list.id}>
          {isList ? (
            <ListListItem
              list={list}
              likes={listLikesByListId(list.id)}
              isLiked={isLiked(list.id)}
              handleLikeClick={handleLikeClick}
            />
          ) : (
            <ListGridItem
              list={list}
              likes={listLikesByListId(list.id)}
              isLiked={isLiked(list.id)}
              handleLikeClick={handleLikeClick}
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export const ListGridItem = ({
  list,
  likes,
  isLiked,
  handleLikeClick,
}: {
  list: List;
  likes?: string[];
  isLiked?: boolean;
  handleLikeClick: (id: string) => void;
}) => {
  return (
    <Card>
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{list.displayName}</CardTitle>
            <AvatarWithName name={list.creatorName} />
          </div>
          <LikesNumber
            likesNumber={likes?.length}
            isLiked={isLiked}
            handleClick={() => handleLikeClick(list.id)}
          />
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
  likes,
  isLiked,
  handleLikeClick,
}: {
  allocation?: string;
  list: List;
  likes?: string[];
  isLiked?: boolean;
  handleLikeClick: (id: string) => void;
}) => {
  return (
    <div className="cursor-pointer space-y-3 pt-6 first:pt-0">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{list.displayName}</CardTitle>
            <Divider orientation={"vertical"} />
            <LikesNumber
              likesNumber={likes?.length}
              isLiked={isLiked}
              handleClick={() => handleLikeClick(list.id)}
            />
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
  handleClick,
  variant = "ghost",
}: {
  likesNumber?: number;
  isLiked?: boolean;
  handleClick: () => void;
  variant?: "ghost" | "outline";
}) => (
  <Button
    variant={variant}
    className="text-gray-600"
    onClick={(e) => {
      e.stopPropagation();
      handleClick();
    }}
  >
    <span className="text-xs">{likesNumber}</span>
    {isLiked ? (
      <Liked className="ml-2 h-4 w-4 text-primary-600" />
    ) : (
      <Like className="ml-2 h-4 w-4" />
    )}
  </Button>
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
