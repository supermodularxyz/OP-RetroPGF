import Link from "next/link";
import { useRouter } from "next/router";

import { Layout } from "~/components/Layout";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, useUpdateFilterFromRouter } from "~/hooks/useFilter";
import { Lists } from "~/components/Lists";
import { useLists } from "~/hooks/useLists";
import { Tag } from "~/components/ui/Tag";
import { Button } from "~/components/ui/Button";
import { Like, Liked } from "~/components/icons";
import { useAccount } from "wagmi";
import { LoadMore } from "~/components/LoadMore";

export default function ListsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("lists");
  const {
    data: lists,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useLists(filter);

  // TODO: Move this to a shared FilterLayout?
  useUpdateFilterFromRouter("lists");

  return (
    <Layout sidebar="left">
      <div className="justify-between md:flex">
        <h1 className="text-2xl font-bold text-gray-900">Lists</h1>

        <div className="items-center gap-2 md:flex">
          <Button
            variant="primary"
            className="my-2 w-full md:my-0 md:w-auto"
            as={Link}
            href="/lists/create"
          >
            New list
          </Button>
          <DisplayAndSortFilter
            baseUrl="/lists"
            filter={filter!}
            sortOptions={["shuffle", "asc", "desc", "liked"]}
          />
        </div>
      </div>
      <div className="no-scrollbar">
        <LikedFilter />
      </div>
      <Lists filter={filter} lists={lists} isLoading={isLoading} />

      <LoadMore isFetching={isFetching} onInView={fetchNextPage} />
    </Layout>
  );
}

const LikedFilter = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("lists");

  const selected = filter?.likedBy === address;
  return (
    <div className="my-2 flex gap-2 overflow-x-auto py-1">
      <Tag
        size="lg"
        as={Link}
        scroll={false}
        selected={!selected}
        href={`/lists?${toURL(query, { likedBy: "" })}`}
      >
        All
      </Tag>
      <Tag
        size="lg"
        disabled={!address || !isConnected}
        scroll={false}
        selected={selected}
        onClick={() =>
          router.push(
            `/lists?${toURL(query, { likedBy: selected ? "" : address })}`
          )
        }
      >
        {selected ? <Liked className="text-primary-600" /> : <Like />} Liked
      </Tag>
    </div>
  );
};
