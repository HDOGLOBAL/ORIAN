"use client";
// Required by Next.js for production error handling
// Also logs errors to GA so you can track them in your dashboard

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "exception", {
        description: error?.message || "unknown",
        fatal: true,
      });
    }
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fff",
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.5rem", color: "#111" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", marginBottom: "1.5rem", maxWidth: "32rem" }}>
            We've been notified and are looking into it. Please try again or return to the homepage.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.75rem 1.5rem", background: "#fd3d57", color: "#fff",
                border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "1rem",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                padding: "0.75rem 1.5rem", background: "transparent", color: "#333",
                border: "1px solid #ccc", borderRadius: "0.5rem",
                textDecoration: "none", fontSize: "1rem",
              }}
            >
              Go home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
