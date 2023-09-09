import type { NextApiRequest, NextApiResponse } from "next";
import { projects } from "~/data/mock";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.send(projects);
}
