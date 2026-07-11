export async function translateText(text, targetLang) {
  if (!text) return "";

  const deepLApiKey = process.env.DEEPL_API_KEY;
  if (deepLApiKey) {
    try {
      return await translateWithDeepL(text, targetLang, deepLApiKey);
    } catch (error) {
      console.error("DeepL translation request failed:", error);
    }
  }

  const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (googleApiKey) {
    try {
      return await translateWithGoogle(text, targetLang, googleApiKey);
    } catch (error) {
      console.error("Google translation request failed:", error);
    }
  }

  console.warn("No translation API key is set. Returning original text.");
  return `[AUTO] ${text}`; // Fallback for testing purposes without API key
}

function isHtml(text) {
  return /<\/?[a-z][\s\S]*>/i.test(text);
}

function getDeepLEndpoint(apiKey) {
  if (process.env.DEEPL_API_ENDPOINT) return process.env.DEEPL_API_ENDPOINT;
  return apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
}

const DEEPL_LANG_MAP = {
  pt: "PT-PT",
  fr: "FR",
  es: "ES",
  he: "HE",
  de: "DE",
  it: "IT",
};

async function translateWithDeepL(text, targetLang, apiKey) {
  const params = new URLSearchParams();
  params.append("text", text);
  params.set("source_lang", "EN");
  params.set("target_lang", DEEPL_LANG_MAP[targetLang] || targetLang.toUpperCase());

  if (isHtml(text)) {
    params.set("tag_handling", "html");
  }

  const response = await fetch(getDeepLEndpoint(apiKey), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.translations?.[0]?.text || text;
}

async function translateWithGoogle(text, targetLang, apiKey) {
  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: isHtml(text) ? "html" : "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translation API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    throw error;
  }
}

// Map of schema suffixes to language codes
export const LANG_MAP = {
  Pt: "pt",
  Fr: "fr",
  Es: "es",
  He: "he",
  De: "de",
  It: "it",
};

function getTranslationSource(doc, key) {
  const source = doc?.translationSource;
  if (!source) return undefined;
  if (typeof source.get === "function") return source.get(key);
  return source[key];
}

function normalizeTranslationSource(source) {
  if (!source) return {};
  if (typeof source.get === "function") return Object.fromEntries(source);
  return { ...source };
}

/**
 * Auto-translates language fields on a document payload.
 * It preserves existing/manual translations, fills empty translations, and
 * refreshes translations previously marked as "auto" when the English source changes.
 * 
 * @param {Object} data - The payload to be saved (e.g., from the admin form)
 * @param {Object} existingDoc - The existing DB document (if updating)
 * @param {Array<String>} baseFields - Fields to translate (e.g., ["name", "description"])
 * @returns {Object} The updated data payload
 */
export async function autoTranslateMissing(data, existingDoc, baseFields = ["name", "description"]) {
  const result = { ...data };
  
  result.translationSource = {
    ...normalizeTranslationSource(existingDoc?.translationSource),
    ...normalizeTranslationSource(data.translationSource),
  };

  for (const field of baseFields) {
    const englishText = result[field] || existingDoc?.[field];
    if (!englishText) continue;

    if (result[field] === undefined) {
      result[field] = englishText;
    }

    const existingEnglishText = existingDoc?.[field] || "";
    const englishChanged = Boolean(existingDoc) && englishText !== existingEnglishText;

    for (const [suffix, langCode] of Object.entries(LANG_MAP)) {
      const targetField = `${field}${suffix}`;
      const sourceKey = targetField;
      const source = result.translationSource[sourceKey] || getTranslationSource(existingDoc, sourceKey);
      const existingTargetText = existingDoc?.[targetField] || "";
      const incomingTargetText = data[targetField] || "";
      const hasIncomingTarget = Boolean(incomingTargetText);
      const hasManualChange =
        hasIncomingTarget && incomingTargetText !== existingTargetText;

      if (hasManualChange || (hasIncomingTarget && !existingDoc)) {
        result.translationSource[sourceKey] = "human";
        result[targetField] = incomingTargetText;
        continue;
      }

      if (incomingTargetText || existingTargetText) {
        if (source === "human" || (!source && existingTargetText)) {
          result.translationSource[sourceKey] = "human";
          result[targetField] = incomingTargetText || existingTargetText;
          continue;
        }
      }

      const currentTargetText = incomingTargetText || existingTargetText;
      const shouldTranslate = !currentTargetText || (source === "auto" && englishChanged);

      if (shouldTranslate) {
        try {
          const translated = await translateText(englishText, langCode);
          result[targetField] = translated;
          result.translationSource[sourceKey] = "auto";
        } catch (error) {
          console.error(`Failed to auto-translate ${targetField}:`, error);
        }
      } else {
        result[targetField] = currentTargetText;
        if (source) {
          result.translationSource[sourceKey] = source;
        }
      }
    }
  }

  return result;
}
