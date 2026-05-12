// Supported UI languages — "he" falls back to "en", "it" is supported
export function getUiLanguage(lang) {
  const supported = ["en", "pt", "fr", "es", "de", "it"];
  if (lang === "he") return "en";
  return supported.includes(lang) ? lang : "en";
}
 