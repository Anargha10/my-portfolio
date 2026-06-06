/**
 * Normalizes common LLM formatting issues so Markdown renders cleanly.
 * @param {string} text
 * @returns {string}
 */
export function normalizeAssistantMarkdown(text) {
  if (!text || typeof text !== "string") return "";

  return text
    .replace(/\r\n/g, "\n")
    .replace(/([.!?])\s+(\d+\.\s+)/g, "$1\n\n$2")
    .replace(/([^\n])\s+(-\s+\*\*)/g, "$1\n$2")
    .replace(/([^\n])\s+(\*\s+\*\*)/g, "$1\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
