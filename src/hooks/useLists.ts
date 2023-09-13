import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialFilter, type Filter } from "./useFilter";
import { sortAndFilter, type Project, paginate } from "./useProjects";
import { allListsLikes, lists } from "~/data/mock";
import { type ImpactCategory } from "./useCategories";
import { useAccount, type Address } from "wagmi";

export type List = {
  id: string;
  displayName: string;
  creatorName: string;
  creatorAvatarUrl: string;
  bio: string;
  impactCategory: ImpactCategory[];
  impactEvaluation: string;
  impactEvaluationLink: string;
  projects: Project[];
};

export function useLists(filter: Filter) {
  const {
    page = 1,
    sort = "shuffle",
    categories = [],
    search = "",
  } = filter ?? initialFilter;

  // TODO: Call EAS attestations

  return useQuery(
    ["lists", { page, sort, categories, search }],
    () =>
      new Promise<{ data: List[]; pages: number }>((resolve) => {
        // Fake server response time
        setTimeout(
          () => resolve(paginate(sortAndFilter(lists, filter), filter?.page)),
          500
        );
      })
  );
}

export function useList(id: string) {
  return useQuery(["lists", id], async () => lists.find((p) => p.id === id), {
    enabled: Boolean(id),
  });
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
