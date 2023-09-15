import axios from "axios";
import { writeFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const easScanURL = process.env.NEXT_PUBLIC_EASSCAN_URL ?? "";
const applicationsSchema = process.env.NEXT_PUBLIC_APPLICATIONS_SCHEMA ?? "";
const profileSchema = process.env.NEXT_PUBLIC_PROFILE_SCHEMA ?? "";

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

type AttestationWithMetadata = { id: string; decodedDataJson: string };
async function fetchAttestations(schema: string) {
  return axios
    .post<{ data: { attestations: AttestationWithMetadata[] } }>(easScanURL, {
      query: AttestationsQuery,
      variables: { where: { schemaId: { equals: schema } } },
    })
    .then((r) => r.data.data.attestations);
}
async function fetchMetadata(url: string) {
  const { data } = await axios.get<{ name: string }>(url);
  if (typeof data === "string") {
    return null;
  }
  return data;
}

async function fetchProjects() {
  return fetchAttestations(applicationsSchema).then((r) =>
    Promise.all(
      r.map(async ({ id, decodedDataJson }) => {
        const { displayName, applicationMetadataPtr } = parseDecodedJSON<{
          applicationMetadataPtr: string;
          displayName: string;
        }>(decodedDataJson);

        const metadata = await fetchMetadata(applicationMetadataPtr);
        return { id, displayName, ...metadata };
      })
    )
  );
}

function fetchProfiles() {
  return fetchAttestations(profileSchema).then((r) =>
    Promise.all(
      r.map(async ({ id, decodedDataJson }) => {
        const { name, profileMetadataPtr } = parseDecodedJSON<{
          profileMetadataPtr: string;
          name: string;
        }>(decodedDataJson);

        const metadata = await fetchMetadata(profileMetadataPtr);
        return { id, name, ...metadata };
      })
    )
  );
}

function parseDecodedJSON<T>(json: string) {
  const data = JSON.parse(json) as { name: string; value: { value: string } }[];
  return data.reduce<T>(
    (acc, x) => ({ ...acc, [x.name]: x.value.value }),
    {} as T
  );
}

(() => {
  void Promise.all([fetchProfiles(), fetchProjects()]).then(
    ([profiles, projects]) => {
      console.log(JSON.stringify(profiles, null, 2));

      writeFileSync(
        "./src/data/profiles.json",
        JSON.stringify(profiles),
        "utf-8"
      );
      writeFileSync(
        "./src/data/projects.json",
        JSON.stringify(projects),
        "utf-8"
      );
    }
  );
})();

function toModel(collection: { id: string }[]) {
  return collection.reduce<{ allIds: string[]; byId: Record<string, unknown> }>(
    (acc, x) => {
      return {
        ...acc,
        byId: { ...acc.byId, [x.id]: x },
        allIds: acc.allIds.concat(x.id),
      };
    },
    { byId: {}, allIds: [] }
  );
}
