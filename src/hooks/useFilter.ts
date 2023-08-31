import { useMutation, useQuery, useQueryClient } from "wagmi";
import { type ImpactCategory } from "./useCategories";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { type ParsedUrlQuery } from "querystring";

type FilterSort = "shuffle" | "asc" | "desc" | "liked" | "ascOP" | "descOP";
export type Filter = {
  page?: number;
  display?: "grid" | "list";
  sort?: FilterSort;
  search?: string;
  categories?: ImpactCategory[];
};

export const defaultSortOptions = [
  "shuffle",
  "asc",
  "desc",
] as Filter["sort"][];

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
  ascOP: "Smallest OP",
  descOP: "Highest OP",
  liked: "Most liked",
};

type FilterType = "projects" | "lists";

export function useFilter(type: FilterType) {
  const client = useQueryClient();

  return useQuery(
    ["filter", type],
    () => client.getQueryData<Filter>(["filter", type]) ?? initialFilter,
    { cacheTime: Infinity }
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

// Make filter and router query stay in sync
export function useUpdateFilterFromRouter(type: FilterType) {
  const router = useRouter();
  const query = router.query;
  const { data: filter } = useFilter(type);
  const { mutate: setFilter } = useSetFilter(type);

  // Update URL when user lands on page
  useEffect(() => {
    // Make sure query is not already set
    if (!router.asPath.includes("?")) {
      void router.replace(`${router.asPath}?${toURL(filter!)}`);
    }
  }, [filter, router]);

  // Update filter when router query changes
  useEffect(() => {
    setFilter(query);
    if (query?.categories) {
      setFilter(parseQuery(query));
    }
  }, [query, setFilter]);
}

export const toURL = (prev: Partial<Filter>, next: Partial<Filter> = {}) =>
  new URLSearchParams({ ...prev, ...next } as unknown as Record<
    string,
    string
  >).toString();

const parseQuery = (query: ParsedUrlQuery) => {
  return {
    ...query,
    // Build array of categories from comma-separated string
    categories:
      ((query.categories as string)
        ?.split(",")
        .filter(Boolean) as Filter["categories"]) ?? [],
  };
};
