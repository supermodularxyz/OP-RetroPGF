import { useQuery } from "wagmi";
import { initialFilter, type Filter } from "./useFilter";
import {  type Project } from "./useProjects";
import { lists } from "~/data/mock";
import { type ImpactCategory } from "./useCategories";

export type List = {
  id: string;
  displayName: string;
  creatorName: string;
  creatorAvatarUrl: string;
  bio: string;
  impactCategory: ImpactCategory[];
  projects: Project[];
  likesNumber: number;
};

export function useLists(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
  } = filter ?? initialFilter;
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // TODO: Call EAS attestations

  // Temporary sorting
  const sortFn = {
    shuffle: (arr: List[]) => arr,
    asc: (arr: List[]) =>
      arr.sort((a, b) => a.displayName.localeCompare(b.displayName)),
    desc: (arr: List[]) =>
      arr.sort((a, b) => b.displayName.localeCompare(a.displayName)),
  }[sort];

  return useQuery(
    ["lists", { page, sort, categories }],
    () =>
      new Promise<{ data: List[]; pages: number }>((resolve) => {
        const data = sortFn([...lists]).filter((project) =>
          categories.length
            ? categories.every((c) => project.impactCategory.includes(c))
            : project
        );

        const pages = Math.ceil(data.length / pageSize);
        return resolve({ data: data.slice(start, end), pages });
      })
  );
}
