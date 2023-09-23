import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const easScanURL = process.env.NEXT_PUBLIC_EASSCAN_URL ?? "";
const applicationsSchema = process.env.NEXT_PUBLIC_APPLICATIONS_SCHEMA ?? "";
const profileSchema = process.env.NEXT_PUBLIC_PROFILE_SCHEMA ?? "";
const listsSchema = process.env.NEXT_PUBLIC_LISTS_SCHEMA ?? "";

const AttestationsQuery = `
  query Attestations($where: AttestationWhereInput) {
    attestations(where: $where) {
      id
      decodedDataJson
      attester
      schemaId
    }
  }
`;

type AttestationWithMetadata = {
  id: string;
  attester: string;
  decodedDataJson: string;
};
async function fetchAttestations(schema: string) {
  return axios
    .post<{ data: { attestations: AttestationWithMetadata[] } }>(easScanURL, {
      query: AttestationsQuery,
      variables: { where: { schemaId: { equals: schema } } },
    })
    .then((r) => r.data.data.attestations);
}

async function fetchMetadata(url: string) {
  const ipfsGateway =
    process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://dweb.link/ipfs/";

  if (!url.startsWith("http")) {
    url = `${ipfsGateway}${url}`;
  }
  const { data } = await axios.get<{ name: string }>(url);
  if (typeof data === "string") {
    return null;
  }
  return data;
}

export async function fetchProjects() {
  return fetchAttestations(applicationsSchema).then((r) =>
    Promise.all(
      r.map(async ({ id, attester, decodedDataJson }) => {
        const { displayName, applicationMetadataPtr } = parseDecodedJSON<{
          applicationMetadataPtr: string;
          displayName: string;
        }>(decodedDataJson);

        const metadata = await fetchMetadata(applicationMetadataPtr);
        return { id, displayName, owner: attester, ...metadata };
      })
    )
  );
}

export async function fetchProfiles() {
  return fetchAttestations(profileSchema).then((r) =>
    Promise.all(
      r.map(async ({ id, attester, decodedDataJson }) => {
        const { name, profileMetadataPtr } = parseDecodedJSON<{
          profileMetadataPtr: string;
          name: string;
        }>(decodedDataJson);
        const metadata = await fetchMetadata(profileMetadataPtr);
        return { id, name, owner: attester, ...metadata };
      })
    )
  );
}

export async function fetchLists() {
  return fetchAttestations(listsSchema).then((r) =>
    Promise.all(
      r.map(async ({ id, attester, decodedDataJson, ...rest }) => {
        console.log({ id, decodedDataJson, rest });

        const { listName, listMetadataPtr } = parseDecodedJSON<{
          listMetadataPtr: string;
          listName: string;
        }>(decodedDataJson);

        console.log(listName, listMetadataPtr);
        const metadata = await fetchMetadata(listMetadataPtr);
        return { id, listName, owner: attester, ...metadata };
      })
    )
  );
}

export function parseDecodedJSON<T>(json: string) {
  const data = JSON.parse(json) as { name: string; value: { value: string } }[];
  return data.reduce<T>(
    (acc, x) => ({ ...acc, [x.name]: x.value.value }),
    {} as T
  );
}
