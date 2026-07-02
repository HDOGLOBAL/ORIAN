export async function translateText(text, targetLang) {
  if (!text) return "";
  
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_TRANSLATE_API_KEY is not set. Returning original text.");
    return `[AUTO] ${text}`; // Fallback for testing purposes without API key
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLang }),
    });

    if (!response.ok) {
      console.error("Translation API error:", response.statusText);
      return text;
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation request failed:", error);
    return text;
  }
}

// Map of schema suffixes to language codes
export const LANG_MAP = {
  Pt: "pt",
  Fr: "fr",
  Es: "es",
  He: "iw", // Google API uses 'iw' for Hebrew, though 'he' often works
  De: "de",
  It: "it",
};

/**
 * Auto-translates missing fields on a document payload.
 * It will not overwrite fields that are marked as "human" in translationSource,
 * and will only translate if the target field is empty.
 * 
 * @param {Object} data - The payload to be saved (e.g., from the admin form)
 * @param {Object} existingDoc - The existing DB document (if updating)
 * @param {Array<String>} baseFields - Fields to translate (e.g., ["name", "description"])
 * @returns {Object} The updated data payload
 */
export async function autoTranslateMissing(data, existingDoc, baseFields = ["name", "description"]) {
  const result = { ...data };
  
  // Initialize or copy translationSource map
  result.translationSource = existingDoc?.translationSource 
    ? (typeof existingDoc.translationSource.get === 'function' ? Object.fromEntries(existingDoc.translationSource) : { ...existingDoc.translationSource })
    : { ...(data.translationSource || {}) };

  for (const field of baseFields) {
    const englishText = result[field];
    if (!englishText) continue;

    for (const [suffix, langCode] of Object.entries(LANG_MAP)) {
      const targetField = `${field}${suffix}`;
      const sourceKey = targetField;
      
      const isHumanEdited = result.translationSource[sourceKey] === "human" || 
                            (existingDoc?.translationSource?.get && existingDoc.translationSource.get(sourceKey) === "human");

      // Check if there is new incoming text manually entered by the user
      const hasNewManualText = data[targetField] && data[targetField] !== (existingDoc?.[targetField] || "");

      if (hasNewManualText) {
        // User explicitly entered something new -> mark as human
        result.translationSource[sourceKey] = "human";
        continue;
      }

      if (isHumanEdited) {
        // Preserve existing human edit
        result[targetField] = data[targetField] || existingDoc?.[targetField];
        continue;
      }

      // If we reach here, it's either auto, or empty. We translate if it's currently empty
      // Or we could re-translate if English changed. But let's only translate if missing for now.
      const currentTargetText = data[targetField] || existingDoc?.[targetField];
      
      // Auto-translate if it's missing entirely
      if (!currentTargetText) {
        try {
          const translated = await translateText(englishText, langCode);
          result[targetField] = translated;
          result.translationSource[sourceKey] = "auto";
        } catch (error) {
          console.error(`Failed to auto-translate ${targetField}`);
        }
      } else {
        result[targetField] = currentTargetText;
      }
    }
  }

  return result;
}
