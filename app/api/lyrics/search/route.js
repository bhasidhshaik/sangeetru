import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
  }

  try {

    const searchUrl = `https://harmonicsurvey.com/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    let results = [];

    $(".inside-article").each((_, el) => {
      const titleElement = $(el).find(".entry-title a");
      const imageElement = $(el).find(".post-image img");

      const title = titleElement.text().trim();
      const url = titleElement.attr("href");
      const image = imageElement.attr("src");

      if (title && url) {
        results.push({ title, url, image });
      }
    });
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Scraping Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch lyrics" }), { status: 500 });
  }
}
