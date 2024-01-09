import { useRouter } from "next/router";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { Layout } from "~/components/Layout";
import { Projects } from "~/components/Projects";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, useUpdateFilterFromRouter } from "~/hooks/useFilter";
import { useProjects } from "~/hooks/useProjects";
import { LoadMore } from "~/components/LoadMore";
import { Banner } from "~/components/ui/Banner";
import { Button } from "~/components/ui/Button";
import Link from "next/link";

export default function StatsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("projects");
  const {
    data: projects,
    error,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
  } = useProjects(filter);

  // TODO: Move this to a shared FilterLayout?

  useUpdateFilterFromRouter("projects");

  console.log("error", error);
  return (
    <Layout sidebar="left">
      <div className="justify-between md:flex">
        <h1 className="text-2xl font-bold text-gray-900">Round 3 Stats</h1>
      </div>
      <pre className="py-24 text-center">not implemented yet</pre>
    </Layout>
  );
}
