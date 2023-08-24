import { useRouter } from "next/router";
import { CategoriesFilter } from "~/components/CategoriesFilter";

import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { Projects } from "~/components/Projects";
import { DisplayToggle } from "~/components/ui/DisplayToggle";
import { useFilter, toURL, type Filter } from "~/hooks/useFilter";
import { useProjects } from "~/hooks/useProjects";

export default function ProjectsPage() {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter();
  const { data: projects } = useProjects(filter!);
  const currentPage = Number(filter?.page);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

        <DisplayToggle baseUrl="/projects" />
       
      </div>

      <CategoriesFilter
        selected={filter?.categories}
        onSelect={(categories) => `/projects?${toURL(query, { categories })}`}
      />
      <Projects filter={filter} projects={projects?.data} />

      <Pagination
        currentPage={currentPage}
        pages={projects?.pages}
        onNavigate={(page) => `/projects?${toURL(query, { page })}`}
      />
    </Layout>
  );
}
