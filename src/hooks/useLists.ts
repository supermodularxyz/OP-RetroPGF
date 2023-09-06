import {
  type Address,
  useMutation,
  useQuery,
  useQueryClient,
  useAccount,
} from "wagmi";
import { initialFilter, type Filter } from "./useFilter";
import { sortAndFilter, type Project, paginate } from "./useProjects";
import { allListsLikes, lists } from "~/data/mock";
import { type ImpactCategory } from "./useCategories";

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
  const { address } = useAccount();
  return useQuery(
    ["likes", listId],
    () => {
      // Call API
      // axios.get(`/likes/${listId}`).then(r => r.data);
      // Temp mock data (even numbers are liked)
      return Number(listId) % 2 == 0 && address ? [address] : [];
    },
    { enabled: Boolean(listId) }
  );
}

export function useLikeList(listId: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (state: boolean) => {
      // Call API
      // axios.post(`/likes/${listId}/like`).then(r => r.data)
      window.alert("toggle like");
    },
    {
      // Optimistically update state
      onMutate: (state: boolean) => {
        // This will update the cached data for this list with the new state
        queryClient.setQueryData(["likes", listId], state);
        // This might be possible also
        queryClient.setQueryData(
          ["likes", listId],
          (prev: boolean | undefined) => !prev
        );
        return { listId, state };
      },
      onError: (err, state, prev) => {
        // Revert if request fails
        queryClient.setQueryData(["likes", prev?.listId], prev?.state);
      },
      // Refetch all likes so it's included in the counts everywhere.
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["likes"] }),
    }
  );
}

export function useAllLikes() {
  return useQuery(["likes"], () => allListsLikes);
}
