export function trimWords(text = "", wordLimit = 20) {
  if (!text) return "";
  return text.length > wordLimit ? text.slice(0, wordLimit) + "..." : text;
}
