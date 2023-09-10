import { type Address } from "viem";

import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

const query = gql`
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      recipient
    }
  }
`;

type Attestation = { attestations: { id: string }[] };

const badgeholderSchema = process.env.NEXT_PUBLIC_BADGEHOLDER_SCHEMA!;
const badgeholderAttester = process.env.NEXT_PUBLIC_BADGEHOLDER_ATTESTER!;
const easScanURL = process.env.NEXT_PUBLIC_EASSCAN_URL!;

/*
TODO:
- create a copy of schema for dev environment 
- create attestations for test addresses

*/
export function useBadgeHolder(address: Address) {
  return useQuery(
    ["badgeholder", address],
    () =>
      request<Attestation>(easScanURL, query, {
        where: {
          recipient: { equals: address },
          schemaId: { equals: badgeholderSchema },
          attester: { equals: badgeholderAttester },
        },
      }).then((r) => true ?? r.attestations?.length > 0),
    { enabled: Boolean(address) }
  );
}
