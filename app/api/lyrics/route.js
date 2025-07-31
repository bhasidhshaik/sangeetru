import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
        return new Response(JSON.stringify({ error: "No query provided" }), { status: 400 });
    }

    try {
        const searchUrl = decodeURIComponent(query);
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.102 Safari/537.36',
            }
        });

        const $ = cheerio.load(response.data);

        // Select the lyrics
        const lyricsDiv = $('.gutena-tab-block.active');
        if (!lyricsDiv.length) {
            return new Response(JSON.stringify({ error: "Lyrics not found" }), { status: 404 });
        }

        let lyrics = "";
        lyricsDiv.find('p').each((i, el) => {
            const html = $(el).html();
            const textWithLineBreaks = html.replace(/<br\s*\/?>/gi, '\n');
            lyrics += textWithLineBreaks.trim() + "\n";
        });

        // 🔍 Extract YouTube video URL
        const iframeSrc = $('figure.wp-block-embed-youtube iframe').attr('src');

        // Convert embed link to normal YouTube link (optional)
        let youtubeUrl = null;
        if (iframeSrc) {
            const match = iframeSrc.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
            if (match) {
                youtubeUrl = `https://www.youtube.com/watch?v=${match[1]}`;
            } else {
                youtubeUrl = iframeSrc;
            }
        }

        return new Response(JSON.stringify({
            lyrics: lyrics.trim(),
            youtubeUrl
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch lyrics", details: error.message }), { status: 500 });
    }
}
