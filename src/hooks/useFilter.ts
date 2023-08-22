import { useMutation, useQuery, useQueryClient } from "wagmi";
import { type ImpactCategory } from "./useProjects";

type FilterSort = "shuffle" | "asc" | "desc";
export type Filter = {
  page?: number;
  display?: "grid" | "list";
  sort?: FilterSort;
  categories: ImpactCategory[];
};

const initialFilter: Filter = {
  page: 1,
  display: "grid",
  sort: "shuffle",
  categories: [],
};

export const sortLabels: { [key in FilterSort]: string } = {
  shuffle: "Shuffle",
  asc: "A to Z",
  desc: "Z to A",
};

export function useFilter() {
  const client = useQueryClient();

  return useQuery(
    ["filter", "projects"],
    () => client.getQueryData<Filter>(["filter", "projects"]) ?? initialFilter,
    { cacheTime: 0 }
  );
}

export function useSetFilter() {
  const client = useQueryClient();

  return useMutation(async (filter: Filter) =>
    client.setQueryData<Filter>(
      ["filter", "projects"],
      (prev = initialFilter) => ({ ...prev, ...filter })
    )
  );
}

export const toURL = (prev: Filter, next: Partial<Filter>) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();
