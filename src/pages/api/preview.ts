import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const previewBaseUrl = `https://web-scrapper-coral.vercel.app/api/read_web_meta_data`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.query.url as string;
    const r = await axios.get<{
      result?: { title: string; description: string; ["og:image"]: string };
    }>(`${previewBaseUrl}?url=${url}`);

    const result = r?.data?.result;
    const title = result?.title;
    const description = result?.description;
    const image = result?.["og:image"];
    return res.json({ title, description, image });
  } catch (error) {
    console.error("Error fetching link metadata", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching link metadata" });
  }
}
