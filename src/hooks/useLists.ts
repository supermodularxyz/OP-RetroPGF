import { useQuery } from "wagmi";
import { initialFilter, type Filter } from "./useFilter";
import { sortAndFilter, type Project } from "./useProjects";
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
    search = "",
  } = filter ?? initialFilter;

  // TODO: Call EAS attestations

  return useQuery(
    ["lists", { page, sort, categories, search }],
    () =>
      new Promise<{ data: List[]; pages: number }>((resolve) => {
        // Fake server response time
        setTimeout(() => resolve(sortAndFilter(lists, filter)), 500);
      })
  );
}
