import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Project } from "./useProjects";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import { trpc } from "~/utils/trpc";

export type Allocation = { projectId: string; amount: number };
type Ballot = Record<string, Allocation>;

export function useAddToBallot() {
  const queryClient = useQueryClient();

  const { data: ballot } = useBallot();
  const save = useSaveBallot();
  return useMutation((vote) => {
    console.log("ballot", ballot, vote);
    const merged = {
      ...ballot,
      votes: ballot?.votes.concat(vote),
    };
    return save.mutateAsync(merged);
  });
  // Accept array of projects because this way we can easily add lists to ballots
  // return useMutation(
  //   async (projects: Allocation[]) => {
  //     console.log("add to ballot", projects);
  //     queryClient.setQueryData(["ballot"], async (ballot: Ballot = {}) => {
  //       return {
  //         votes: projects,
  //       };
  //     });
  //   }
  //   // queryClient.setQueryData(["ballot"], (ballot: Ballot = {}) =>
  //   //   projects.reduce((acc, x) => ({ ...acc, [x.projectId]: x }), ballot)
  //   // )
  // );
}

export function useRemoveFromBallot() {
  const queryClient = useQueryClient();
  return useMutation(async (allocationId: string) =>
    queryClient.setQueryData(["ballot"], (ballot: Ballot = {}) => {
      const { [allocationId]: removed, ..._ballot } = ballot;
      return _ballot;
    })
  );
}

export function useBallot() {
  return trpc.ballot.get.useQuery(undefined);
}

export function useSaveBallot() {
  return trpc.ballot.save.useMutation();
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API!;

export function useSubmitBallot({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const { data: ballot } = useBallot();
  const sign = useSignMessage();
  const { address } = useAccount();

  return useMutation(() => {
    const message = "sign_ballot_message";
    return sign.signMessageAsync({ message }).then((signature) =>
      axios
        .post(`${backendUrl}/api/ballot/submit`, {
          address,
          signature,
          votes: mapBallotForBackend(ballot),
        })
        .then(onSuccess)
    );
  });
}

export function useSubmittedBallot() {
  return trpc.ballot.get.useQuery();
}

/*
Ballot only include id and amount.
To be able to search for projects we need to have the project displayName.
Fetch the data for the project from the cache. The data will be there because it's being loaded in the AllocationForm.

The reason we do this instead of adding the project data to the ballot 
is because the lists only contain project id and OP amount (see ListEditDistribution) 
*/
export function useBallotProjectData() {
  const queryClient = useQueryClient();

  return (
    allocations: { projectId: string; amount: number }[]
  ): (Project & { key: string })[] =>
    allocations.map((p) => ({
      ...queryClient.getQueryData(["projects", p.projectId])!,
      ...p,
    }));
}

export const ballotToArray = (ballot: Ballot = {}) =>
  Object.keys(ballot ?? {}).map((id) => ({
    id,
    ...ballot[id],
  })) as Allocation[];

export const arrayToBallot = (allocations: Allocation[] = []): Ballot =>
  allocations.reduce((acc, x) => ({ ...acc, [x.projectId]: x }), {});

export const sumBallot = (allocations: Allocation[] = []) =>
  allocations.reduce((sum, x) => sum + (x?.amount ?? 0), 0);

export const countBallot = (ballot: Ballot = {}) => 0;
// export const countBallot = (ballot: Ballot = {}) => Object.keys(ballot).length;

function mapBallotForBackend(ballot?: Ballot) {
  return ballotToArray(ballot).map((p) => ({
    projectId: p.projectId,
    amount: p.amount,
  }));
}
