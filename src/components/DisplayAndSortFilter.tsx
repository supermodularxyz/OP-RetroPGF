import Link from "next/link";
import { toURL, type Filter } from "~/hooks/useFilter";
import { useRouter } from "next/router";
import { Divider } from "./ui/Divider";
import { SortBy } from "./SortBy";
import { IconButton } from "~/components/ui/Button";
import { LayoutGrid, LayoutList } from "~/components/icons";

type Props = {
  baseUrl: string;
  filter: Filter;
  sortOptions: Filter["sort"][];
};

export const DisplayAndSortFilter = ({
  baseUrl,
  filter,
  sortOptions,
}: Props) => {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  return (
    <div className="flex gap-2 overflow-x-auto">
      <DisplayButton filter={filter} display="list" baseUrl={baseUrl} />
      <div className="flex py-2">
        <Divider orientation={"vertical"} />
      </div>
      <DisplayButton filter={filter} display="grid" baseUrl={baseUrl} />
      <SortBy
        options={sortOptions}
        value={filter?.sort}
        onChange={(sort) =>
          void router.push(`${baseUrl}?${toURL(query, { sort })}`)
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
