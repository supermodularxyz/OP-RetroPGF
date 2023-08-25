import { useMutation, useQuery, useQueryClient } from "wagmi";
import { type ImpactCategory } from "./useCategories";

type FilterSort = "shuffle" | "asc" | "desc";
export type Filter = {
  page?: number;
  display?: "grid" | "list";
  sort?: FilterSort;
  categories: ImpactCategory[];
};

export const initialFilter: Filter = {
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

export function useFilter(type: "projects" | "lists") {
  const client = useQueryClient();

  return useQuery(
    ["filter", type],
    () => client.getQueryData<Filter>(["filter", type]) ?? initialFilter,
    { cacheTime: 0 }
  );
}

export function useSetFilter(type: "projects" | "lists") {
  const client = useQueryClient();

  return useMutation(async (filter: Filter) =>
    client.setQueryData<Filter>(["filter", type], (prev = initialFilter) => ({
      ...prev,
      ...filter,
    }))
  );
}

export const toURL = (prev: Partial<Filter>, next: Partial<Filter> | undefined) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();
