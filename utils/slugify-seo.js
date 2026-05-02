// Slug utility for SEO-friendly product URLs
// "Hobart Dishwasher Spray Arm" → "hobart-dishwasher-spray-arm"

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // strip accents (é→e, ü→u)
    .replace(/[^a-z0-9\s-]/g, "")     // strip non-alphanumeric
    .trim()
    .replace(/\s+/g, "-")              // spaces to hyphens
    .replace(/-+/g, "-")               // collapse repeated hyphens
    .replace(/^-+|-+$/g, "");          // trim leading/trailing hyphens
}

// Build /shop/{name-slug}-{shortId}  e.g. /shop/hobart-spray-arm-a8f2c1d4
// Keeps the DB id for lookups while adding keyword value to the URL
export function productSlug(product) {
  if (!product) return "";
  const name = product.name || "product";
  const id = String(product.id || product._id || "");
  const shortId = id.slice(-8);
  return `${slugify(name)}-${shortId}`;
}

// Extract the original short ID from a slugged param
// "hobart-spray-arm-a8f2c1d4" → "a8f2c1d4"
export function extractIdFromSlug(slug = "") {
  const parts = String(slug).split("-");
  return parts[parts.length - 1] || slug;
}
