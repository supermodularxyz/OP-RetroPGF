import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { type PropsWithChildren, useEffect } from "react";
import { useFilter, useSetFilter, toURL, type Filter } from "~/hooks/useFilter";
import { useRouter } from "next/router";
import { Divider } from "./Divider";

type Props = {
  baseUrl: string;
};

export const DisplayToggle = ({ baseUrl }: Props) => {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter();
  const { mutate: setFilter } = useSetFilter();

  useEffect(() => {
    setFilter(query);
  }, [query, setFilter]);

  return (
    <div className="flex gap-2">
      <DisplayButton filter={filter!} display="list" baseUrl={baseUrl}>
        L
      </DisplayButton>
      <Divider orientation={"vertical"} />
      <DisplayButton filter={filter!} display="grid" baseUrl={baseUrl}>
        G
      </DisplayButton>
    </div>
  );
};

const DisplayButton = ({
  display,
  filter,
  baseUrl,
  children,
}: {
  display: Filter["display"];
  filter: Filter;
  baseUrl: string;
} & PropsWithChildren) => {
  return (
    <Button
      as={Link}
      href={`${baseUrl}?${toURL(filter, { display })}`}
      variant={filter?.display === display ? "default" : "ghost"}
    >
      {children}
    </Button>
  );
};
