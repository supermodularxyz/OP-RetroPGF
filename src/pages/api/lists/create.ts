import type { NextApiRequest, NextApiResponse } from "next";
import { type ListAttestation } from "~/hooks/useCreateList";
import { createAttestation } from "~/utils/eas";

interface ApiRequest extends NextApiRequest {
  body: ListAttestation;
}
export default async function handler(req: ApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Verify user can create list

      // Create Attestation
      const attestation = await createAttestation(req.body);
      console.log("New attestation UID:", attestation);
      // Regenerate lists data

      res.send({ attestation });
    } catch (error) {
      console.log(error, error.statusCode);
      res.status(error.status ?? 500).send({ error });
    }
  } else {
    res.status(405);
  }
}
