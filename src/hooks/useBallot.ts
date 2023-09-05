import { useMutation, useQuery, useQueryClient } from "wagmi";
import { Project } from "./useProjects";

type Allocation = { id: string; amount?: number };
type Ballot = Record<string, Allocation>;

export function useAddToBallot() {
  const queryClient = useQueryClient();
  // Accept array of projects because this way we can easily add lists to ballots
  return useMutation(async (projects: Allocation[]) =>
    queryClient.setQueryData(["ballot"], (ballot: Ballot = {}) =>
      projects.reduce((acc, x) => ({ ...acc, [x.id]: x }), ballot)
    )
  );
}

export function useRemoveFromBallot() {
  const queryClient = useQueryClient();
  return useMutation(async (project: Allocation) =>
    queryClient.setQueryData(["ballot"], (ballot: Ballot = {}) => {
      const { [project.id]: removed, ..._ballot } = ballot;
      return _ballot;
    })
  );
}

export function useBallot() {
  const queryClient = useQueryClient();
  return useQuery(
    ["ballot"],
    async () => queryClient.getQueryData<Ballot>(["ballot"]) ?? {}
  );
}

export function useSaveBallot() {
  const queryClient = useQueryClient();
  return useMutation(async (ballot: Ballot) =>
    queryClient.setQueryData(["ballot"], ballot)
  );
}

export function useBallotProjectData() {
  const queryClient = useQueryClient();

  return (
    allocations: { id: string; amount: number }[]
  ): (Project & { key: string })[] =>
    allocations.map((p) => ({
      ...queryClient.getQueryData(["projects", p.id])!,
      ...p,
    }));
}

export const ballotToArray = (ballot: Ballot = {}) =>
  Object.keys(ballot).map((id) => ({
    id,
    ...ballot[id],
  }));

export const arrayToBallot = (allocations: Allocation[] = []): Ballot =>
  allocations.reduce((acc, x) => ({ ...acc, [x.id]: x }), {});

export const sumBallot = (allocations: Allocation[]) =>
  allocations.reduce((sum, x) => sum + (x?.amount ?? 0), 0);

export const countBallot = (ballot: Ballot = {}) => Object.keys(ballot).length;
