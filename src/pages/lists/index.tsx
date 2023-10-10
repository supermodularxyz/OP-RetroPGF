import Link from "next/link";
import { useRouter } from "next/router";

import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, useUpdateFilterFromRouter } from "~/hooks/useFilter";
import { Lists } from "~/components/Lists";
import { useLists } from "~/hooks/useLists";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { Tag } from "~/components/ui/Tag";
import { Button } from "~/components/ui/Button";
import { Like } from "~/components/icons";

export default function ListsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("lists");
  const { data: lists, isLoading } = useLists(filter);
  const currentPage = Number(filter?.page);

  // TODO: Move this to a shared FilterLayout?
  useUpdateFilterFromRouter("lists");

  return (
    <Layout sidebar="left">
      <div className="justify-between md:flex">
        <h1 className="text-2xl font-bold text-gray-900">Lists</h1>

        <div className="flex items-center gap-2">
          <Button variant="primary" as={Link} href="/lists/create">
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
        <div className="my-2 flex gap-2 overflow-x-auto py-1">
          <Tag
            size="lg"
            as={Link}
            scroll={false}
            href={`/lists?${toURL(query, { categories: [] })}`}
          >
            All
          </Tag>
          <Tag size="lg" onClick={() => alert("not implemented yet")}>
            <Like /> Liked
          </Tag>
        </div>
      </div>
      <Lists filter={filter} lists={lists?.data} isLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        pages={lists?.pages}
        onNavigate={(page) => `/lists?${toURL(query, { page })}`}
      />
    </Layout>
  );
}
