import clsx from "clsx";
import { Tag } from "~/components/ui/Tag";
import { type Filter } from "~/hooks/useFilter";
import { impactCategoryLabels, type Project } from "~/hooks/useProjects";
import { createComponent } from "./ui";
import { tv } from "tailwind-variants";
import { List } from "~/hooks/useLists";
import { Card } from "./ui/Card";
import { CardTitle } from "./ui/CardTitle";
import { ProjectImage } from "./ui/ProjectImage";
import { ImpactCategories } from "./ui/ImpactCategories";

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
      {lists?.map((list) =>
        isList ? (
          <ListListItem key={list.id} list={list} />
        ) : (
          <ListGridItem key={list.id} list={list} />
        )
      )}
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
            <div className="flex items-center gap-2 mt-1">
              <div className="h-5 w-5 rounded-full bg-gray-200"></div>
              <p className="text-sm font-semibold">{list.creatorName} </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs">{list.likesNumber}</span>
            <span className="text-xs">[h]</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex">
            {list.projects.slice(0, 4).map((project) => (
              <div key={project.id} className="-mx-1">
                <ProjectImage small={true} />
              </div>
            ))}
          </div>
          {list.projects.length > 4 && (
            <p className="text-xs text-neutral-600">
              +{list.projects.length - 4} projects
            </p>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-neutral-700 sm:line-clamp-2">
          {list.bio}
        </p>

        <ImpactCategories tags={list.impactCategory} />
      </div>
    </Card>
  );
};
