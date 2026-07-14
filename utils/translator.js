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

  // Free fallback (no API key required). Only used for plain text so we never
  // risk breaking HTML markup inside rich-text descriptions.
  if (!isHtml(text)) {
    try {
      return await translateWithMyMemory(text, targetLang);
    } catch (error) {
      console.error("MyMemory translation request failed:", error);
    }
  }

  console.warn("All translation providers failed. Falling back to source text.");
  return `${text}`;
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
  const translated = data.translations?.[0]?.text;
  if (!translated) throw new Error("DeepL returned an empty translation");
  return translated;
}

async function translateWithGoogle(text, targetLang, apiKey) {
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
  const translated = data?.data?.translations?.[0]?.translatedText;
  if (!translated) throw new Error("Google returned an empty translation");
  return translated;
}

async function translateWithMyMemory(text, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=en|${targetLang}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`MyMemory API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseDetails || "MyMemory returned no translation");
  }
  return data.responseData.translatedText;
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

export const BASE_TRANSLATABLE_FIELDS = ["name", "description"];

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

function emptyToUndefined(value) {
  return value === "" || value == null ? undefined : value;
}

/**
 * Auto-translates language fields on a document payload.
 *
 * Behaviour:
 *  - New content (no existingDoc) is translated into every supported language.
 *  - Existing translations are never overwritten:
 *      * user-provided ("human") translations are kept as-is,
 *      * previously auto-translated ("auto") fields are only refreshed when the
 *        English source actually changed.
 *  - Untranslated / empty fields are always filled.
 *
 * On any translation failure the source text is used as a fallback so a
 * language field is never left empty.
 *
 * @param {Object} data - The payload to be saved (e.g. from the admin form)
 * @param {Object} existingDoc - The existing DB document (if updating)
 * @param {Array<String>} baseFields - Fields to translate (e.g. ["name", "description"])
 * @returns {Object} The updated data payload (includes `translationSource`)
 */
export async function autoTranslateMissing(data, existingDoc, baseFields = BASE_TRANSLATABLE_FIELDS) {
  const result = { ...data };

  const translationSource = {
    ...normalizeTranslationSource(existingDoc?.translationSource),
    ...normalizeTranslationSource(data.translationSource),
  };
  result.translationSource = translationSource;

  const jobs = [];

  for (const field of baseFields) {
    const englishText = emptyToUndefined(result[field]) ?? emptyToUndefined(existingDoc?.[field]);
    if (!englishText) continue;

    if (result[field] === undefined) result[field] = englishText;

    const existingEnglishText = emptyToUndefined(existingDoc?.[field]) ?? "";
    const englishChanged = Boolean(existingDoc) && englishText !== existingEnglishText;

    for (const [suffix, langCode] of Object.entries(LANG_MAP)) {
      const targetField = `${field}${suffix}`;
      const sourceKey = targetField;

      const existingTargetText = emptyToUndefined(existingDoc?.[targetField]) ?? "";
      const incomingTargetText = emptyToUndefined(data[targetField]) ?? "";
      const source =
        translationSource[sourceKey] ?? getTranslationSource(existingDoc, sourceKey);

      // 1. A translation was provided in the payload (manual edit / new content).
      if (incomingTargetText && incomingTargetText !== existingTargetText) {
        translationSource[sourceKey] = "human";
        result[targetField] = incomingTargetText;
        continue;
      }
      if (!existingDoc && incomingTargetText) {
        translationSource[sourceKey] = "human";
        result[targetField] = incomingTargetText;
        continue;
      }

      // 2. An existing translation that must not be auto-overwritten -> keep it.
      if (existingTargetText && source !== "auto") {
        translationSource[sourceKey] = source || "human";
        result[targetField] = existingTargetText;
        continue;
      }

      // 3. Otherwise translate only when empty or when the auto source changed.
      const currentTargetText = incomingTargetText || existingTargetText;
      const shouldTranslate = !currentTargetText || (source === "auto" && englishChanged);

      if (shouldTranslate) {
        translationSource[sourceKey] = "auto";
        jobs.push(
          translateText(englishText, langCode)
            .then((translated) => ({
              targetField,
              text: emptyToUndefined(translated) ?? englishText,
            }))
            .catch((error) => {
              console.error(`Failed to auto-translate ${targetField}:`, error);
              return { targetField, text: englishText };
            })
        );
      } else {
        result[targetField] = currentTargetText;
        if (source) translationSource[sourceKey] = source;
      }
    }
  }

  const translated = await Promise.all(jobs);
  for (const { targetField, text } of translated) {
    result[targetField] = text;
  }

  return result;
}
