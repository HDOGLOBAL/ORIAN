import { useEffect, useState } from "react";

export function useDomain() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      if (hostname.includes(".co.uk") || (hostname.includes(".uk") && !hostname.includes(".co.uk"))) {
        setLang("en"); // UK → English + GBP
      } else if (hostname.includes(".de")) {
        setLang("de"); // German
      } else if (hostname.includes(".fr")) {
        setLang("fr"); // French
      } else if (hostname.includes(".es")) {
        setLang("es"); // Spanish
      } else if (hostname.includes(".pt")) {
        setLang("pt"); // Portuguese
      } else if (hostname.includes(".eu")) {
        setLang("en"); // EU → English + EUR
      } else if (hostname.includes(".co.il") || hostname.includes(".il")) {
        setLang("he"); // Hebrew
      } else {
        setLang("en"); // .com and everything else → English
      }
    }
  }, []);

  return lang;
}
