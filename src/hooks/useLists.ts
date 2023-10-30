import axios from "axios";
import { useAccount, type Address } from "wagmi";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { initialFilter, type Filter } from "./useFilter";
import { type Allocation } from "./useBallot";
import { type ImpactCategory } from "./useCategories";
import { ListQuery, ListsQuery } from "~/graphql/queries";
import { Aggregate, createQueryVariables, parseId } from "~/graphql/utils";
import { Project } from "./useProjects";
import { useAccessToken } from "./useAuth";

export type List = {
  id: string;
  listName: string;
  listDescription: string;
  owner: string;
  categories: ImpactCategory[];
  impactEvaluationDescription: string;
  impactEvaluationLink: string;
  projects: Allocation[];
  listContent: {
    OPAmount: number;
    project: Project;
  }[];
  author: {
    address: Address;
    resolvedName: {
      name?: string;
    };
  };
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useLists(
  filter: Filter = initialFilter,
  opts?: { enabled?: boolean }
) {
  const query = useInfiniteQuery({
    enabled: opts?.enabled,
    queryKey: ["lists", filter],
    queryFn: ({ pageParam }: { pageParam?: string }) => {
      console.log("Fetching lists", pageParam);
      return axios
        .post<{
          data: {
            retroPGF: {
              lists: {
                edges: { node: List }[];
                pageInfo: { hasNextPage: boolean; endCursor?: string };
              };
              listsAggregate: Aggregate;
            };
          };
          errors?: { message: string }[];
        }>(`${backendUrl}/graphql`, {
          query: ListsQuery,
          variables: createQueryVariables({ ...filter, after: pageParam }),
        })
        .then((r) => {
          const { lists, listsAggregate } = r.data.data?.retroPGF ?? {};
          if (r.data?.errors?.length) {
            throw r.data.errors?.[0]?.message;
          }
          const data = lists?.edges.map((edge) => mapList(edge.node));
          const { total, ...categories } = listsAggregate ?? {};

          return { data, categories, pageInfo: lists?.pageInfo };
        });
    },
    getNextPageParam: (lastPage) => lastPage.pageInfo?.endCursor,
  });

  return {
    ...query,
    data: query.data?.pages?.flatMap((p) => p.data).filter(Boolean),
    fetchNextPage: () =>
      query.hasNextPage &&
      query.fetchNextPage({
        pageParam:
          query.data?.pages?.[query.data?.pages?.length - 1]?.pageInfo
            .endCursor,
      }),
  };
}

export function useList(id: string) {
  return useQuery(
    ["lists", id],
    async () =>
      axios
        .post<{ data: { retroPGF: { list: List } } }>(`${backendUrl}/graphql`, {
          query: ListQuery,
          variables: { id },
        })
        .then((r) => mapList(r.data.data?.retroPGF.list) ?? null),
    { enabled: Boolean(id) }
  );
}

export function mapList(list: List) {
  return {
    ...parseId(list),
    listContent: list.listContent.map((item) => ({
      ...item,
      project: parseId(item.project),
    })),
  } as List;
}

export function useLikes(listId: string) {
  return useQuery<Address[]>(
    ["likes", listId],
    () =>
      axios
        .get(`${backendUrl}/api/likes/${listId}`)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        .then((r) => r.data[encodeURIComponent(listId)] ?? []),
    { enabled: Boolean(listId) }
  );
}

export function useLikeList(listId: string) {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { data: token } = useAccessToken();

  return useMutation(
    async (listId: string) => {
      return axios.post(`${backendUrl}/api/likes/${listId}/like`, undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      // Optimistically update state
      onMutate: () => {
        // This will update the cached data for this list with the new state
        queryClient.setQueryData(["likes", listId], (prev: Address[] = []) => {
          return prev.includes(address!)
            ? prev.filter((a) => a !== address)
            : prev.concat(address!);
        });
        return { listId };
      },

      // Refetch all likes so it's included in the counts everywhere.
      onSettled: () => queryClient.invalidateQueries(["likes"]),
    }
  );
}

type AllLikesResponse = {
  likes: {
    listId: Address[];
  };
};

export function useAllLikes() {
  return useQuery<AllLikesResponse>(
    ["likes"],
    () => axios.get(`${backendUrl}/api/likes`),
    {}
  );
}
