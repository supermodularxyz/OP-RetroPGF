import { useQuery } from "wagmi";
import { type Filter } from "./useFilter";
import {
  ImpactCategory,
  Project,
  impactCategoryLabels,
  projects,
} from "./useProjects";

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

const lists: List[] = Array.from({ length: 25 })
  .fill(0)
  .map((_, id) => ({
    id: String(id),
    displayName: `List ${id + 1}`,
    creatorName: "verycoolperson",
    creatorAvatarUrl: "",
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    impactCategory: Array.from({
      length: Math.floor(Math.random() * 2) + 1,
    }).map((_, i) => Object.keys(impactCategoryLabels)[i]) as ImpactCategory[],
    projects,
    likesNumber: 12,
  }));

export function useLists(filter: Filter) {
  const { page } = filter ?? {};
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // TODO: Call EAS attestations
  return useQuery(
    ["lists", { page }],
    () => new Promise<List[]>((resolve) => resolve(lists.slice(start, end)))
  );
}
