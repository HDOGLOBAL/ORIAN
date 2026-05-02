"use client";
// Core Web Vitals (LCP, CLS, INP, FID) are Google ranking signals since 2021
// This sends them to Google Analytics 4 so you can monitor and improve scores

import { useReportWebVitals } from "next/web-vitals";

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") return;

    const { id, name, label, value } = metric;

    // Send to GA4
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, {
        event_category: label === "web-vital" ? "Web Vitals" : "Next.js metric",
        event_label: id,
        value: Math.round(name === "CLS" ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Also push to dataLayer for GTM if used
    if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "web-vitals",
        web_vitals_name: name,
        web_vitals_value: value,
        web_vitals_id: id,
      });
    }
  });

  return null;
}
