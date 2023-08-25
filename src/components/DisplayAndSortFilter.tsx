import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { type PropsWithChildren, useEffect } from "react";
import { useFilter, useSetFilter, toURL, type Filter } from "~/hooks/useFilter";
import { useRouter } from "next/router";
import { Divider } from "./ui/Divider";
import { SortBy } from "./SortBy";
import { IconButton } from "~/components/ui/Button";
import { LayoutGrid, LayoutList } from "~/components/icons";

type Props = {
  baseUrl: string;
  type: "projects" | "lists";
};

export const DisplayAndSortFilter = ({ baseUrl, type }: Props) => {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter(type);
  const { mutate: setFilter } = useSetFilter(type);

  useEffect(() => {
    setFilter(query);
    if (query?.categories) {
      const categories =
        ((query.categories as unknown as string)
          ?.split(",")
          .filter(Boolean) as Filter["categories"]) ?? [];
      setFilter({ ...query, categories });
    }
  }, [query, setFilter]);

  return (
    <div className="flex gap-2">
      <DisplayButton filter={filter!} display="list" baseUrl={baseUrl} />
      <Divider orientation={"vertical"} />
      <DisplayButton filter={filter!} display="grid" baseUrl={baseUrl} />
      <SortBy
        value={filter?.sort}
        onChange={(sort) =>
          void router.push(
            `${baseUrl}?${toURL(query, { sort: sort as Filter["sort"] })}`
          )
        }
      />
    </div>
  );
};

const DisplayButton = ({
  display,
  filter,
  baseUrl,
}: {
  display: Filter["display"];
  filter: Filter;
  baseUrl: string;
}) => {
  const isActive = filter?.display === display;
  const icons = {
    list: LayoutList,
    grid: LayoutGrid,
  };
  return (
    <IconButton
      icon={icons[display!]}
      as={Link}
      href={`${baseUrl}?${toURL(filter, { display })}`}
      variant={isActive ? "default" : "ghost"}
      className={isActive ? "" : "text-gray-600"}
    />
  );
};
