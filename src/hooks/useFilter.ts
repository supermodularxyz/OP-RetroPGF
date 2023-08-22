import { useMutation, useQuery, useQueryClient } from "wagmi";

export type Filter = {
  page: number;
  display?: "grid" | "list";
};
const initialFilter = {
  page: 1,
  display: "grid" as const,
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
