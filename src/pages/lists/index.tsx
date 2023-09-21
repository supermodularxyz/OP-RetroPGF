import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useRouter } from "next/router";
import {
  useFilter,
  toURL,
  type Filter,
  useUpdateFilterFromRouter,
} from "~/hooks/useFilter";
import { Lists } from "~/components/Lists";
import { useLists } from "~/hooks/useLists";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { Tag } from "~/components/ui/Tag";
import { Divider } from "~/components/ui/Divider";
import { Like } from "~/components/icons";
import Link from "next/link";

export default function ListsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("lists");
  const { data: lists } = useLists(filter!);
  const currentPage = Number(filter?.page);

  // TODO: Move this to a shared FilterLayout?
  useUpdateFilterFromRouter("lists");

  console.log("lists", lists);

  return (
    <Layout sidebar="left">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lists</h1>

        <DisplayAndSortFilter
          baseUrl="/lists"
          filter={filter!}
          sortOptions={["shuffle", "asc", "desc", "liked"]}
        />
      </div>
      <div className="no-scrollbar">
        <CategoriesFilter
          selected={filter?.categories}
          onSelect={(categories) =>
            `/lists?${toURL(query, { categories, page: 1 })}`
          }
        >
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
          <div className="flex items-center py-2">
            <Divider orientation="vertical" />
          </div>
        </CategoriesFilter>
      </div>
      <Lists filter={filter} lists={lists?.data} />
      <Pagination
        currentPage={currentPage}
        pages={lists?.pages}
        onNavigate={(page) => `/lists?${toURL(query, { page })}`}
      />
    </Layout>
  );
}
