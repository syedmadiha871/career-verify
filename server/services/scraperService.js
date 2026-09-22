/**
 * High-Speed Web Page Job Posting Scraper Service
 * Fetches HTML from public job links with a fast 3.5s timeout.
 */

async function fetchAndExtractJobText(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid URL provided.");
  }

  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500); // Fast 3.5s timeout

  try {
    const response = await fetch(cleanUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Web page returned status ${response.status}.`);
    }

    const html = await response.text();

    // Extract Page Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let pageTitle = titleMatch ? titleMatch[1].trim() : "Extracted Job Posting";
    let extractedText = "";

    // 1. Attempt JSON-LD JobPosting Schema Extraction (Greenhouse, Lever, LinkedIn, Indeed, Workday)
    const jsonLdMatches = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const scriptTag of jsonLdMatches) {
        try {
          const jsonContent = scriptTag.replace(/<[^>]+>/g, "").trim();
          const parsed = JSON.parse(jsonContent);
          const jobData = Array.isArray(parsed) ? parsed.find(item => item["@type"] === "JobPosting") : (parsed["@type"] === "JobPosting" ? parsed : null);

          if (jobData) {
            const schemaTitle = jobData.title || jobData.name;
            const company = jobData.hiringOrganization?.name || jobData.publisher?.name;
            const desc = (jobData.description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

            if (schemaTitle) pageTitle = schemaTitle;
            if (desc.length > 50) {
              extractedText = `${schemaTitle ? "Job Title: " + schemaTitle + "\n" : ""}${company ? "Company: " + company + "\n" : ""}${desc}`;
              break;
            }
          }
        } catch (e) {
          // Ignore JSON parse errors in non-JobPosting script tags
        }
      }
    }

    // 2. Fallback to DOM HTML Text Stripping if JSON-LD is unavailable
    if (!extractedText) {
      extractedText = html
        .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
        .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
        .replace(/<svg\b[^<]*>([\s\S]*?)<\/svg>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    if (extractedText.length > 8000) {
      extractedText = extractedText.substring(0, 8000);
    }

    return {
      url: cleanUrl,
      title: pageTitle,
      extractedText,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Target web page took too long to respond (3.5s timeout). Please copy and paste the job text manually.");
    }
    console.error("Scraper Service Error:", err.message);
    throw new Error(`Could not scrape target URL (${err.message}). Please paste the job description text manually.`);
  }
}

module.exports = {
  fetchAndExtractJobText,
  scrapeJobUrl: fetchAndExtractJobText,
};
