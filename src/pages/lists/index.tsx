import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useRouter } from "next/router";
import { useFilter, toURL, type Filter } from "~/hooks/useFilter";
import { Lists } from "~/components/Lists";
import { useLists } from "~/hooks/useLists";
import { CategoriesFilter } from "~/components/CategoriesFilter";

export default function ListsPage() {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter("lists");
  const { data: lists } = useLists(filter!);
  const currentPage = Number(filter?.page);
  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lists</h1>

        <DisplayAndSortFilter baseUrl="/lists" type="lists" />
      </div>

      <CategoriesFilter
        selected={filter?.categories}
        onSelect={(categories) => `/lists?${toURL(query, { categories })}`}
        type="lists"
      />
      <Lists filter={filter} lists={lists?.data} />

      <Pagination
        currentPage={currentPage}
        pages={lists?.pages}
        onNavigate={(page) => `/lists?${toURL(query, { page })}`}
      />
    </Layout>
  );
}
