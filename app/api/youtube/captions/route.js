import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  console.log("Fetching captions for videoId:", videoId);
  

  if (!videoId) {
    return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
  }

  try {
    const captions = await YoutubeTranscript.fetchTranscript(videoId);

    const simplified = captions.map(({ text, offset, duration }) => ({
      text,
      start: offset / 1000, // convert ms to seconds
      dur: duration / 1000,
    }));
    console.log("Fetched captions:", simplified);

    return NextResponse.json({ captions: simplified });
  } catch (err) {
    console.error("Failed to fetch transcript:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
