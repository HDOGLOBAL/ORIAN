"use client";

import { useState, useEffect, Fragment, useMemo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiSearch, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import countries from "@/database/countries.json";
import Cookies from "js-cookie";

export default function CountrySelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const searchInputRef = useRef(null);

  const textMap = {
    en: { title: "Select Your Country", desc: "Please help us to show you correct prices and currency.", search: "Search countries...", noMatch: "No matching countries found", saved: "Your selection will be saved for future visits" },
    pt: { title: "Selecione o Seu País", desc: "Ajude-nos a mostrar-lhe os preços e moeda corretos.", search: "Pesquisar países...", noMatch: "Nenhum país encontrado", saved: "A sua seleção será guardada para futuras visitas" },
    fr: { title: "Sélectionnez Votre Pays", desc: "Aidez-nous à vous afficher les prix et la devise corrects.", search: "Rechercher des pays...", noMatch: "Aucun pays correspondant trouvé", saved: "Votre sélection sera enregistrée pour les visites futures" },
    es: { title: "Seleccione Su País", desc: "Ayúdenos a mostrarle los precios y la moneda correctos.", search: "Buscar países...", noMatch: "No se encontraron países coincidentes", saved: "Su selección se guardará para futuras visitas" },
    he: { title: "בחרו את המדינה שלכם", desc: "עזור לנו להציג לכם מחירים ומטבע נכונים.", search: "חפש מדינות...", noMatch: "לא נמצאו מדינות מתאימות", saved: "הבחירה שלכם תישמר לביקורים עתידיים" },
    de: { title: "Wählen Sie Ihr Land", desc: "Helfen Sie uns, Ihnen die richtigen Preise und Währungen anzuzeigen.", search: "Länder suchen...", noMatch: "Keine passenden Länder gefunden", saved: "Ihre Auswahl wird für zukünftige Besuche gespeichert" },
    it: { title: "Seleziona il Tuo Paese", desc: "Aiutaci a mostrarti i prezzi e la valuta corretti.", search: "Cerca paesi...", noMatch: "Nessun paese corrispondente trovato", saved: "La tua selezione verrà salvata per visite future" },
  };

  // Load saved country from cookies
  useEffect(() => {
    // Only show currency selector on .com domain
    const hostname = window.location.hostname.toLowerCase();
    const isComDomain =
      (hostname.includes("hdotrade.com") || hostname.includes("localhost") || hostname.includes("hdotrade.local.com")) &&
      !hostname.includes(".de") &&
      !hostname.includes(".eu") &&
      !hostname.includes(".fr") &&
      !hostname.includes(".es") &&
      !hostname.includes(".pt") &&
      !hostname.includes(".uk") &&
      !hostname.includes(".it");

    if (!isComDomain) return; // Skip modal entirely on non-.com domains

    const savedCountry = Cookies.get("selectedCountry");
    if (savedCountry) {
      try {
        const parsed = JSON.parse(savedCountry);
        if (parsed?.code) {
          setSelectedCountry(parsed);
        }
      } catch {
        Cookies.remove("selectedCountry", { path: "/" });
      }
    } else {
      setIsOpen(true); // Force open if no saved selection
    }
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handle selection → set in cookies
  const handleSelect = (country) => {
    setSelectedCountry(country);
    Cookies.set("selectedCountry", JSON.stringify(country), {
      expires: 30, // 30 days
      path: "/", // accessible everywhere
    });
    setIsOpen(false);
    setError("");
    router.refresh(); // reload current page
  };

  // Prevent close without selection
  const handleClose = () => {
    if (!selectedCountry) {
      setError("You must select a country before continuing.");
      return;
    }
    setIsOpen(false);
    setError("");
  };

  return (
    <div className="country-selector">
      {/* Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={handleClose} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white shadow-xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-200">
                  <Dialog.Title className="text-xl font-bold text-gray-900">
                    {(() => { const h = typeof window !== "undefined" ? window.location.hostname : ""; const l = h.includes(".it") ? "it" : h.includes(".de") ? "de" : h.includes(".fr") ? "fr" : h.includes(".es") ? "es" : h.includes(".pt") ? "pt" : "en"; return textMap[l]?.title || textMap.en.title; })()}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-500 mt-1">
                    {(() => { const h = typeof window !== "undefined" ? window.location.hostname : ""; const l = h.includes(".it") ? "it" : h.includes(".de") ? "de" : h.includes(".fr") ? "fr" : h.includes(".es") ? "es" : h.includes(".pt") ? "pt" : "en"; return textMap[l]?.desc || textMap.en.desc; })()}
                  </Dialog.Description>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search countries..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredCountries.map((country) => (
                        <li key={country.code}>
                          <button
                            onClick={() => handleSelect(country)}
                            className={`flex items-center w-full p-4 text-left transition-colors ${
                              selectedCountry?.code === country.code
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {country.flag && (
                              <span className="text-2xl mr-3">
                                {country.flag}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {country.name}
                              </p>
                              <span className="text-sm text-gray-500">
                                {country.code}
                              </span>
                            </div>
                            {selectedCountry?.code === country.code && (
                              <FiCheck className="text-blue-600 min-w-[20px] h-5" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      No matching countries found
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
                  Your selection will be saved for future visits
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}