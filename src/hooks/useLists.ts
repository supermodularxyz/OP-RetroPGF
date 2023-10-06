import axios from "axios";
import { useAccount, type Address } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialFilter, type Filter } from "./useFilter";
import { allListsLikes } from "~/data/mock";
import { type Allocation } from "./useBallot";
import { type ImpactCategory } from "./useCategories";
import { ListQuery, ListsQuery } from "~/graphql/queries";
import { Aggregate, createQueryVariables, PAGE_SIZE } from "~/graphql/utils";
import { Project } from "./useProjects";

export type List = {
  id: string;
  listName: string;
  listDescription: string;
  owner: string;
  categories: ImpactCategory[];
  impactEvaluation: string;
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

export function useLists(filter: Filter = initialFilter) {
  return useQuery(["lists", filter], () => {
    return axios
      .post<{
        data: {
          retroPGF: {
            lists: { edges: { node: List }[] };
            listsAggregate: Aggregate;
          };
        };
      }>(`${backendUrl}/graphql`, {
        query: ListsQuery,
        variables: createQueryVariables(filter),
      })
      .then((r) => {
        const { lists, listsAggregate } = r.data.data.retroPGF;

        const data = lists.edges.map((edge) => edge.node);
        const { total, ...categories } = listsAggregate;
        const pages = Math.ceil(total / PAGE_SIZE);

        return { data, pages, categories };
      })
      .catch((err) => {
        console.log("err", err);
        return { data: [], pages: 1, categories: {} };
      });
  });
}

export function useList(id: string) {
  return useQuery(
    ["lists", id],
    async () =>
      axios
        .post<{ data: { retroPGF: { list: List } } }>(`${backendUrl}/graphql`, {
          query: ListQuery,
          variables: {
            id: id.split("|")[1],
          },
        })
        .then((r) => r.data.data?.retroPGF.list ?? null),
    { enabled: Boolean(id) }
  );
}

export function useLikes(listId: string) {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  return useQuery<Address[]>(
    ["likes", listId],
    () => {
      // Call API
      // axios.get(`/likes/${listId}`).then(r => r.data);
      // Temp mock data (even numbers are liked)
      return queryClient.getQueryData(["likes", listId]) ?? [];
      // return Number(listId) % 2 == 0 && address ? [address] : [];
    },
    { enabled: Boolean(listId) }
  );
}

export function useLikeList(listId: string) {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return useMutation(
    async () => {
      // Call API
      // axios.post(`/likes/${listId}/like`).then(r => r.data)
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
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["likes"] }),
    }
  );
}

export function useAllLikes() {
  return useQuery(["likes"], () => allListsLikes);
}
