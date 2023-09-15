import type { NextApiRequest, NextApiResponse } from "next";

import projects from "~/data/projects.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.send(projects);
}
