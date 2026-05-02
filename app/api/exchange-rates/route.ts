export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP");
    const data = await res.json();
    return Response.json({ usd: data.rates.USD, gbp: data.rates.GBP });
  } catch {
    return Response.json({ usd: 1.08, gbp: 0.86 });
  }
}