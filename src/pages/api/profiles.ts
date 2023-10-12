import type { NextApiRequest, NextApiResponse } from "next";

import profiles from "~/data/profiles.json";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.send(profiles);
}
