import { useMutation, useQuery, useQueryClient } from "wagmi";
import { type ImpactCategory } from "./useCategories";
import { useRouter } from "next/router";
import { useEffect } from "react";

type FilterSort = "shuffle" | "asc" | "desc";
export type Filter = {
  page?: number;
  display?: "grid" | "list";
  sort?: FilterSort;
  search?: string;
  categories?: ImpactCategory[];
};

export const initialFilter: Filter = {
  page: 1,
  display: "grid",
  sort: "shuffle",
  search: "",
  categories: [],
};

export const sortLabels: { [key in FilterSort]: string } = {
  shuffle: "Shuffle",
  asc: "A to Z",
  desc: "Z to A",
};

type FilterType = "projects" | "lists";
export function useFilter(type: FilterType) {
  const client = useQueryClient();

  return useQuery(
    ["filter", type],
    () => client.getQueryData<Filter>(["filter", type]) ?? initialFilter,
    { cacheTime: 0 }
  );
}

export function useSetFilter(type: FilterType) {
  const client = useQueryClient();

  return useMutation(async (filter: Filter) =>
    client.setQueryData<Filter>(["filter", type], (prev = initialFilter) => ({
      ...prev,
      ...filter,
    }))
  );
}

export function useUpdateFilterFromRouter(type: FilterType) {
  const router = useRouter();
  const query = router.query;
  const { mutate: setFilter } = useSetFilter(type);

  useEffect(() => {
    setFilter(query);
    if (query?.categories) {
      // Build array of categories from comma-separated string
      const categories =
        ((query.categories as unknown as string)
          ?.split(",")
          .filter(Boolean) as Filter["categories"]) ?? [];
      setFilter({ ...query, categories });
    }
  }, [query, setFilter]);
}

export const toURL = (
  prev: Partial<Filter>,
  next: Partial<Filter> | undefined
) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();
