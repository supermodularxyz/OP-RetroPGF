import Link from "next/link";
import { useRouter } from "next/router";
import { type PropsWithChildren, useEffect } from "react";
import { ProjectsCategoriesFilter } from "~/components/ProjectsCategoriesFilter";

import { Layout } from "~/components/Layout";
import { Pagination } from "~/components/Pagination";
import { Projects } from "~/components/Projects";
import { SortBy } from "~/components/SortBy";
import { Button } from "~/components/ui/Button";
import { Divider } from "~/components/ui/Divider";
import { useFilter, useSetFilter, toURL, type Filter } from "~/hooks/useFilter";
import { useProjects } from "~/hooks/useProjects";

export default function ProjectsPage() {
  const router = useRouter();
  const query = router.query as unknown as Filter;

  const { data: filter } = useFilter();
  const { data: projects } = useProjects(filter!);
  const { mutate: setFilter } = useSetFilter();
  const currentPage = Number(filter?.page);

  useEffect(() => {
    const categories =
      ((query.categories as unknown as string)
        ?.split(",")
        .filter(Boolean) as Filter["categories"]) ?? [];
    setFilter({ ...query, categories });
  }, [query, setFilter]);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

        <div className="flex gap-2">
          <DisplayButton filter={filter!} display="list">
            L
          </DisplayButton>
          <Divider orientation={"vertical"} />
          <DisplayButton filter={filter!} display="grid">
            G
          </DisplayButton>
          <SortBy
            value={filter?.sort}
            onChange={(sort) =>
              void router.push(
                `/projects?${toURL(query, { sort: sort as Filter["sort"] })}`
              )
            }
          />
        </div>
      </div>

      <ProjectsCategoriesFilter
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

const DisplayButton = ({
  display,
  filter,
  children,
}: { display: Filter["display"]; filter: Filter } & PropsWithChildren) => {
  return (
    <Button
      as={Link}
      href={`/projects?${toURL(filter, { display })}`}
      variant={filter?.display === display ? "default" : "ghost"}
    >
      {children}
    </Button>
  );
};
