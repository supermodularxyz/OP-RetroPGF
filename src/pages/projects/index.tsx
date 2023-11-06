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

export default function ProjectsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <DisplayAndSortFilter
          baseUrl="/projects"
          filter={filter!}
          sortOptions={["shuffle", "asc", "desc", "byIncludedInBallots"]}
        />
      </div>
      <div className="no-scrollbar">
        <CategoriesFilter
          type="projects"
          selected={filter?.categories}
          onSelect={(categories) => `/projects?${toURL(query, { categories })}`}
        />
      </div>

      {error ? (
        <Banner variant="warning">
          <div className="flex flex-col items-center gap-4">
            <div>There was an error fetching the projects</div>
            <Button
              as={Link}
              className="w-48"
              variant="primary"
              href="/projects?seed=0"
            >
              Retry
            </Button>
          </div>
        </Banner>
      ) : null}

      <Projects filter={filter} projects={projects} isLoading={isLoading} />
      <LoadMore isFetching={isFetching} onInView={fetchNextPage} />
    </Layout>
  );
}
