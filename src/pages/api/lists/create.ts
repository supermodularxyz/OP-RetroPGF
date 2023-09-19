import type { NextApiRequest, NextApiResponse } from "next";
import type { CreateList } from "~/schemas/list";

interface ApiRequest extends NextApiRequest {
  body: CreateList;
}
export default function handler(req: ApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const list = parseList(req.body);
    // Verify user can create list
    // Upload metadata
    // Create Attestation
    // Regenerate lists data
    res.send(list);
  } else {
    res.status(405);
  }
}

function parseList({ allocations, ...list }: CreateList) {
  return {
    ...list,
    listContent: allocations.map(({ id, amount }) => ({
      RPGF3_Application_UID: id,
      OPAmount: amount,
    })),
  };
}
