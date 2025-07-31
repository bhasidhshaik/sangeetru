import axios from "axios";

// Debounce function to prevent excessive API calls
export function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  
// Function to fetch search results from LyricsRaag
export async function fetchLyricsRaagResults(query) {
  if (!query) return [];

  try {
    const searchUrl = `https://lyricsraag.com/search/?q=${encodeURIComponent(query)}`;
    console.log("Fetching URL:", searchUrl); // ✅ Check if URL is correct

    const { data } = await axios.get(searchUrl);
    console.log("Response Data:", data); // ✅ Check the full response

    // Parse the HTML response
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    // Extract song results
    const links = [...doc.querySelectorAll("h2.entry-title a")].map((el) => ({
      title: el.textContent.trim(),
      url: el.href,
    }));

    console.log("Extracted Results:", links); // ✅ Check if data is correctly extracted

    return links;
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
}
