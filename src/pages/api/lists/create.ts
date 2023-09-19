import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Upload metadata
    // Create Attestation
    // Regenerate lists data
    res.send({});
  } else {
    res.status(405);
  }
}
