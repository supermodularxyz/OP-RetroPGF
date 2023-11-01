import axios from "axios";
import * as cheerio from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const url = req.query.url as string;
    const r = await axios.get(decodeURIComponent(url));
    const $ = cheerio.load(r?.data as string);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");

    res.json({ title, description, image });
  } catch (error) {
    console.error("Error fetching link metadata", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching link metadata" });
  }
}
