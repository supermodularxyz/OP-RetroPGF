import type { NextApiRequest, NextApiResponse } from "next";
import { lists } from "~/data/mock";
import { fetchLists } from "~/utils/attestations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const lists = await fetchLists();

  res.send(
    lists.map((item) =>
      mapList(
        item as unknown as {
          listName: string;
          listContent: { RPGF3_Application_UID: string; OPAmount: number }[];
        }
      )
    )
  );
}

function mapList({
  listContent,
  listName,
  ...attestation
}: {
  listName: string;
  listContent: { RPGF3_Application_UID: string; OPAmount: number }[];
}) {
  return {
    ...attestation,
    displayName: listName,
    projects: listContent.map((p) => ({
      id: p.RPGF3_Application_UID,
      amount: p.OPAmount,
    })),
  };
}
