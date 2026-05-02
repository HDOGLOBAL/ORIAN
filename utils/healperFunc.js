export function calculateTotalByFields(products, ...fields) {
  return products.reduce((total, item) => {
    fields.forEach((field) => {
      total += item[field] || 0;
    });
    return total;
  }, 0);
}
