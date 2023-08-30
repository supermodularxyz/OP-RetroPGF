import { useRouter } from "next/router";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { Projects } from "~/components/Projects";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, useUpdateFilterFromRouter } from "~/hooks/useFilter";
import { useProjects } from "~/hooks/useProjects";

export default function ProjectsPage() {
  const router = useRouter();
  const query = router.query;

  const { data: filter } = useFilter("projects");
  const { data: projects } = useProjects(filter!);
  const currentPage = Number(filter?.page);

  // TODO: Move this to a shared FilterLayout?
  useUpdateFilterFromRouter("projects");

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <DisplayAndSortFilter baseUrl="/projects" filter={filter!} />
      </div>
      <div className="no-scrollbar">
        <CategoriesFilter
          selected={filter?.categories}
          onSelect={(categories) => `/projects?${toURL(query, { categories })}`}
          type="projects"
        />
      </div>

      <Projects filter={filter} projects={projects?.data} />

      <Pagination
        currentPage={currentPage}
        pages={projects?.pages}
        onNavigate={(page) => `/projects?${toURL(query, { page })}`}
      />
    </Layout>
  );
}
