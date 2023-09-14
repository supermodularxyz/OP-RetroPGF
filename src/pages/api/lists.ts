import type { NextApiRequest, NextApiResponse } from "next";
import { lists } from "~/data/mock";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.send(lists);
}
