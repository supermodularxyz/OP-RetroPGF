import { useAccount, useMutation, useQuery, useQueryClient } from "wagmi";
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

// /likes/:list_id/like
export function useLikeList() {
  const queryClient = useQueryClient();
  return useMutation(async (listId: string) =>
    queryClient.setQueryData(["listId"], listId)
  );
}

// /likes/:list_id
export function useListLikes(id: string) {
  const { address } = useAccount();
  // return array of addresses that likes this list
  return useQuery(["listLikes", id], async () =>
    Number(id) % 2 == 0 && address ? [address] : []
  );
}

// /likes
export function useAllListsLikes() {
  
  return useQuery(["allListsLikes"], async () => {
    return {
      likes: allListsLikes,
    };
  });
}
