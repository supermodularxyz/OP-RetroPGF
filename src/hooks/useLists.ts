import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialFilter, type Filter } from "./useFilter";
import { sortAndFilter, paginate } from "./useProjects";
import { allListsLikes } from "~/data/mock";
import { useAccount, type Address } from "wagmi";
import { type Allocation } from "./useBallot";
import { type ImpactCategory } from "./useCategories";
import axios from "axios";

export type List = {
  id: string;
  listName: string;
  displayName: string;
  owner: string;
  bio: string;
  impactCategory: ImpactCategory[];
  impactEvaluation: string;
  impactEvaluationLink: string;
  projects: Allocation[];
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useAllLists() {
  return useQuery<List[]>(["lists", "all"], () =>
    fetch("/api/lists").then((r) => r.json())
  );
}
export function useLists(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  // TODO: Call EAS attestations
  const { data: lists, isLoading } = useAllLists();
  return useQuery(
    ["lists", { page, sort, categories, search }],
    () => paginate(sortAndFilter(lists, filter), filter?.page),
    { enabled: !isLoading }
  );
}

export function useList(id: string) {
  const { data: lists, isLoading } = useAllLists();
  return useQuery(["lists", id], async () => lists?.find((p) => p.id === id), {
    enabled: Boolean(id && !isLoading),
  });
}

export function useLikes(listId: string) {
  return useQuery<Address[]>(
    ["likes", listId],
    () => axios.get(`${backendUrl}/api/likes/${listId}`),
    { enabled: Boolean(listId) }
  );
}

export function useLikeList(listId: string) {
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return useMutation(
    async (listId: string) => {
      return axios.post(`${backendUrl}/api/likes/${listId}/like`);
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
