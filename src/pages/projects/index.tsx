import { useRouter } from "next/router";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { Layout } from "~/components/Layout";
import { Projects } from "~/components/Projects";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, useUpdateFilterFromRouter } from "~/hooks/useFilter";
import { useProjects } from "~/hooks/useProjects";
import { LoadMore } from "~/components/LoadMore";

export default function ProjectsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("projects");
  const {
    data: projects,
    isLoading,
    isFetching,
    fetchNextPage,
  } = useProjects(filter);

  // TODO: Move this to a shared FilterLayout?
  useUpdateFilterFromRouter("projects");

  return (
    <Layout sidebar="left">
      <div className="justify-between md:flex">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <DisplayAndSortFilter
          baseUrl="/projects"
          filter={filter!}
          sortOptions={["shuffle", "asc", "desc"]}
        />
      </div>
      <div className="no-scrollbar">
        <CategoriesFilter
          selected={filter?.categories}
          onSelect={(categories) => `/projects?${toURL(query, { categories })}`}
        />
      </div>

      <Projects filter={filter} projects={projects} isLoading={isLoading} />
      <LoadMore isFetching={isFetching} onInView={fetchNextPage} />
    </Layout>
  );
}
