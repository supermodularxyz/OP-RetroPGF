import { useRouter } from "next/router";
import { CategoriesFilter } from "~/components/CategoriesFilter";
import { useEffect } from "react";
import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { Projects } from "~/components/Projects";
import { DisplayAndSortFilter } from "~/components/DisplayAndSortFilter";
import { useFilter, toURL, type Filter } from "~/hooks/useFilter";
import { SortBy } from "~/components/SortBy";
import { IconButton } from "~/components/ui/Button";
import { Divider } from "~/components/ui/Divider";
import { useProjects } from "~/hooks/useProjects";
import { Like, Liked, LayoutGrid, LayoutList } from "~/components/icons";

export default function ProjectsPage() {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter("projects");
  const { data: projects } = useProjects(filter!);
  const currentPage = Number(filter?.page);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

        <DisplayAndSortFilter baseUrl="/projects" type="projects" />
      </div>
        <CategoriesFilter
          selected={filter?.categories}
          onSelect={(categories) => `/projects?${toURL(query, { categories })}`}
          type="projects"
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
