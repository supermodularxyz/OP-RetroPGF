import { type Address } from "viem";

import { request, gql } from "graphql-request";
import { useQuery } from "wagmi";

const query = gql`
  query Attestations {
    attestations {
      id
      recipient
      data
    }
  }
`;

type Attestation = { attestations: { id: string }[] };

export function useBadgeHolder(address: Address) {
  return useQuery(
    ["badgeholder", address],
    () =>
      request<Attestation>(`https://optimism.easscan.org/graphql`, query, {
        input: { schemaId: "" },
      }).then((r) => r.attestations?.length > 0),
    { enabled: Boolean(address) }
  );
}
