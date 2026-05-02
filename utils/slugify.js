/**
 * URL-safe slug from arbitrary text (lowercase, hyphenated).
 */
export function slugify(text) {
  if (text == null || String(text).trim() === "") return "";
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Default category URL segment: manufacturer + category (unique per manufacturer in DB).
 */
export function buildCategorySlugBase(manufacturerName, categoryLabel) {
  const m = slugify(manufacturerName);
  const c = slugify(categoryLabel);
  if (!m && !c) return "";
  if (!m) return c;
  if (!c) return m;
  return `${m}-${c}`;
}

/**
 * If the user pasted or stored a full slug like "nike-laptops", keep only the category
 * segment "laptops" so we do not build "nike-nike-laptops" when recomputing.
 */
export function categorySlugSegmentForManufacturer(manufacturerName, slugOrNameInput) {
  const m = slugify(manufacturerName);
  const full = slugify(slugOrNameInput);
  if (!full) return slugify(String(slugOrNameInput || "").trim());
  if (m && full.startsWith(`${m}-`)) {
    const rest = full.slice(m.length + 1);
    return rest || full;
  }
  return full;
}
