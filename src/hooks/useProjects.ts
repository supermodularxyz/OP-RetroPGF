import { useQuery } from "wagmi";
import { type Filter } from "./useFilter";

export type Project = {
  id: string;
  displayName: string;
  bio: string;
  impactCategory: string;
};

const projects: Project[] = Array.from({ length: 25 })
  .fill(0)
  .map((_, id) => ({
    id: String(id),
    displayName: `Project ${id + 1}`,
    bio: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    impactCategory: "COLLECTIVE_GOVERNANCE",
  }));

export function useProjects(filter: Filter) {
  const { page } = filter ?? {};
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // TODO: Call EAS attestations
  return useQuery(
    ["projects", { page }],
    () =>
      new Promise<Project[]>((resolve) => resolve(projects.slice(start, end)))
  );
}
