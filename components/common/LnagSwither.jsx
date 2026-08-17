"use client";

import ReactCountryFlag from "react-country-flag";
import { useState, useEffect, useRef } from "react";

export default function LanguageSwitcher() {
  const [currentDomain, setCurrentDomain] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname);
    }

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    {
      // UK → English + GBP (pound)
      code: "uk",
      countryCode: "GB",
      language: "English (UK) -  £ GBP",
      title: "UK",
      link: "https://hdotrade.uk/",
      domainMatch: ".uk",
    },
    {
      // AU → English + AUD
      code: "au",
      countryCode: "AU",
      language: "English (AU) -  $ AUD",
      title: "AU",
      link: "https://hdotrade.com/",
      domainMatch: "hdotrade.com",
    },
    {
      // COM → English + USD
      code: "com",
      countryCode: "US",
      language: "English (USA) -  $ USD",
      title: "USA",
      link: "https://hdotrade.com/",
      domainMatch: "hdotrade.com",
    },
    {
      // PT → Portuguese + EUR
      code: "pt",
      countryCode: "PT",
      language: "Português -  € EUR",
      title: "PT",
      link: "https://www.hdotrade.pt/",
      domainMatch: ".pt",
    },
    {
      // DE → German + EUR
      code: "de",
      countryCode: "DE",
      language: "Deutsch -  € EUR",
      title: "DE",
      link: "https://hdotrade.de/",
      domainMatch: ".de",
    },
    {
      // ES → Spanish + EUR
      code: "es",
      countryCode: "ES",
      language: "Español -  € EUR",
      title: "ES",
      link: "https://hdotrade.es/",
      domainMatch: ".es",
    },
    {
      // FR → French + EUR
      code: "fr",
      countryCode: "FR",
      language: "Français -  € EUR",
      title: "FR",
      link: "https://hdotrade.fr/",
      domainMatch: ".fr",
    },
    {
      // IT → Italian + EUR
      code: "it",
      countryCode: "IT",
      language: "Italiano -  € EUR",
      title: "IT",
      link: "https://hdotrade.it/",
      domainMatch: ".it",
    },
    {
      // EU → English + EUR
      code: "eu",
      countryCode: "EU",
      language: "EU -  € EUR",
      title: "EU",
      link: "https://hdotrade.eu/",
      domainMatch: ".eu",
    },
  ];

  const isComDomain =
    (currentDomain.includes("hdotrade.com") || currentDomain.includes("hdotrade.local.com")) &&
    !currentDomain.includes("hdotrade.com.");

  const activeItem =
    languages.find((l) => l.code === "com" && isComDomain) ||
    languages.find((l) => l.code === "eu" && currentDomain.includes(".eu") && !currentDomain.includes(".uk")) ||
    languages.find((l) => l.code !== "com" && l.code !== "eu" && currentDomain.includes(l.domainMatch)) ||
    languages[0];

  return (
    <div className="relative" dir="ltr" ref={menuRef} suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-gray-700 hover:border-[#fd3d57] hover:text-[#fd3d57] transition-colors"
        title="Country / Language"
      >
        <ReactCountryFlag
          countryCode={activeItem.countryCode}
          svg
          style={{ width: "1.4em", height: "1em" }}
        />
        <span className="text-sm font-semibold leading-none">{activeItem.title}</span>
        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1.5L5 5.5L9 1.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 z-50 w-64 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {languages.map((item) => {
            const isActive = item.code === activeItem.code;
            return (
              <a
                key={item.code}
                href={item.link}
                onClick={() => setIsOpen(false)}
                role="option"
                aria-selected={isActive}
                title={item.language}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  isActive ? "font-semibold text-[#fd3d57]" : "text-gray-700"
                }`}
              >
                <ReactCountryFlag
                  countryCode={item.countryCode}
                  svg
                  style={{ width: "1.4em", height: "1em" }}
                />
                <span className="flex-1 truncate">{item.language}</span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7.5L5.5 11L12 3.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
