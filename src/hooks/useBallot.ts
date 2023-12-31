import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { type Project } from "./useProjects";
import { useAccessToken } from "./useAuth";
import { useBeforeUnload } from "react-use";
import { ethers } from "ethers";

export type Allocation = { projectId: string; amount: number };

export type Ballot = {
  id?: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  votes: Allocation[];
};

export function useAddToBallot() {
  const { data: ballot } = useBallot();
  const save = useSaveBallot();
  return useMutation((votes: Allocation[]) =>
    save.mutateAsync(mergeBallot(ballot!, votes).votes)
  );
}

export function useRemoveFromBallot() {
  const save = useSaveBallot();
  const { data: ballot } = useBallot();
  return useMutation(async (projectId: string) => {
    const updated = ballot?.votes.filter((v) => v.projectId !== projectId);
    if (updated) {
      return save.mutateAsync(updated);
    }
    return null;
  });
}

export function useSaveBallot() {
  const queryClient = useQueryClient();
  const { data: token } = useAccessToken();

  const save = useMutation(
    async (votes: Allocation[]) =>
      axios.post(
        `${backendUrl}/api/ballot/save`,
        { votes: mapBallotForBackend(votes) },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    { onSuccess: () => queryClient.invalidateQueries(["ballot"]) }
  );
  useBeforeUnload(save.isLoading, "You have unsaved changes, are you sure?");

  return save;
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
  const { data: token } = useAccessToken();

  return useMutation(async () => {
    const votes = mapBallotForBackend(ballot?.votes);
    const isTrezor = await axios
      .post<{ isTrezor: boolean }>(`${backendUrl}/api/auth/is-trezor`, {
        address,
      })
      .then((r) => r.data?.isTrezor);

    const message = isTrezor
      ? ethers.utils.keccak256(Buffer.from(JSON.stringify(votes)))
      : JSON.stringify(votes);

    console.log({ isTrezor });
    return sign.signMessageAsync({ message }).then((signature) =>
      axios
        .post(
          `${backendUrl}/api/ballot/submit`,
          {
            address,
            signature,
            votes,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(onSuccess)
    );
  });
}

export function useBallot() {
  const { address } = useAccount();
  const { data: token } = useAccessToken();
  return useQuery(
    ["ballot", { address, token }],
    () =>
      axios
        .get<Ballot>(`${backendUrl}/api/ballot/${address}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((r) => r.data ?? {}),
    { enabled: Boolean(address && token), cacheTime: 0, staleTime: 0 }
  );
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
  ): (Project & Allocation & { key: string })[] =>
    allocations.map((p) => ({
      ...queryClient.getQueryData(["projects", p.projectId])!,
      ...p,
    }));
}

export function ballotContains(id: string, ballot?: Ballot) {
  return ballot?.votes.find((v) => v.projectId === id);
}

export const sumBallot = (allocations: Allocation[] = []) =>
  allocations.reduce(
    (sum, x) => sum + (!isNaN(Number(x?.amount)) ? Number(x.amount) : 0),
    0
  );

function mapBallotForBackend(votes: Allocation[] = []) {
  return votes.map((p) => ({
    projectId: p.projectId,
    amount: String(p.amount),
  }));
}

function toObject(arr: object[] = [], key: string) {
  return arr?.reduce(
    (acc, x) => ({ ...acc, [x[key as keyof typeof acc]]: x }),
    {}
  );
}
function mergeBallot(ballot: Ballot, addedVotes: Allocation[]): Ballot {
  return {
    ...ballot,
    votes: Object.values({
      ...toObject(ballot?.votes, "projectId"),
      ...toObject(addedVotes, "projectId"),
    }),
  };
}
