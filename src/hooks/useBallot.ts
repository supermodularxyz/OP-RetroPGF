import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Project } from "./useProjects";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import { trpc } from "~/utils/trpc";

export type Allocation = { projectId: string; amount: number };

export type Ballot = {
  votes: Allocation[];
};

function toObject(arr: object[], key: string) {
  return arr?.reduce(
    (acc, x) => ({ ...acc, [x[key as keyof typeof acc]]: x }),
    {}
  );
}
function mergeBallot(ballot: Ballot, addedVotes: Allocation[]): Ballot {
  return {
    ...ballot,
    votes: Object.values({
      ...toObject(ballot.votes, "projectId"),
      ...toObject(addedVotes, "projectId"),
    }),
  };
}
export function useAddToBallot() {
  const { data: ballot } = useBallot();
  const save = useSaveBallot();
  return useMutation((votes: Allocation[]) =>
    save.mutateAsync(mergeBallot(ballot!, votes))
  );
}

export function useRemoveFromBallot() {
  const save = useSaveBallot();
  const { data: ballot } = useBallot();
  return useMutation((projectId: string) =>
    save.mutateAsync({
      id: ballot?.id,
      votes: ballot?.votes.filter(
        (v) => v.projectId !== projectId
      ) as Allocation[],
    })
  );
}

export function useBallot() {
  return trpc.ballot.get.useQuery();
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

export const arrayToBallot = (ballot: {
  votes: { projectId: string; amount: number }[];
}): Record<string, Allocation> =>
  ballot.votes?.reduce((acc, x) => ({ ...acc, [x.projectId]: x }), {});

export const sumBallot = (allocations: Allocation[] = []) =>
  allocations.reduce((sum, x) => sum + (x?.amount ?? 0), 0);

export const countBallot = (ballot: Ballot) => ballot?.votes.length;
// export const countBallot = (ballot: Ballot = {}) => Object.keys(ballot).length;

function mapBallotForBackend(ballot?: Ballot) {
  return ballotToArray(ballot).map((p) => ({
    projectId: p.projectId,
    amount: p.amount,
  }));
}
