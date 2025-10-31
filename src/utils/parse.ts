export function parseAnswer(text: string) {
    const videoPattern = /\[VIDEO:(.+?)\]/;
    const match = text.match(videoPattern);
  
    if (!match) {
      return { text, videoId: null };
    }
  
    const videoId = match[1].trim();
    // Remove the video marker and any "Click here to watch video" text that appears before it
    // First, remove any "Click here to watch video" text immediately before the marker (case insensitive)
    let cleanedText = text.replace(/\s*[Cc]lick\s+here\s+to\s+watch\s+video[.:\s]*\[VIDEO:/i, "[VIDEO:");
    // Now remove the video marker itself
    cleanedText = cleanedText.replace(videoPattern, "").trim();
    // Clean up any trailing colons, spaces, or punctuation
    cleanedText = cleanedText.replace(/[:\s]+$/, "").trim();
  
    return { text: cleanedText, videoId };
  }
  