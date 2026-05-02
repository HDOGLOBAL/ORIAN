"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "./Search";
import Image from "next/image";
import { useState } from "react";
import {
  AngelDownIcon,
  CartIcon,
  SearchIcon,
  ThreeDotIcon,
} from "@/public/icons/icons";
import { useCart } from "@/providers/CartContext";
import { useDomain } from "@/providers/useDomain";
import { getUiLanguage } from "@/utils/uiLanguage";
import logo from "@/public/client/logo.png";
import LanguageSwitcher from "./LnagSwither";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const cartLengths = cart?.items?.length || 0;
  const lang = useDomain();
  const uiLang = getUiLanguage(lang);
  const isRtl = uiLang === "he";

  const textMap = {
    home: { pt: "Início", fr: "Accueil", es: "Inicio", en: "Home", he: "בית", de: "Startseite" },
    store: { pt: "Loja", fr: "Boutique", es: "Tienda", en: "Store", he: "חנות", de: "Shop" },
    aboutUs: { pt: "Sobre N׳s", fr: "À Propos", es: "Sobre Nosotros", en: "About Us", he: "אודותינו", de: "Über uns" },
    contactUs: { pt: "Contato", fr: "Contact", es: "Contacto", en: "Contact Us", he: "צור קשר", de: "Kontakt" },
    cart: { pt: "Carrinho", fr: "Panier", es: "Carrito", en: "Cart", he: "עגלת קניות", de: "Warenkorb" },
    search: { pt: "Pesquisar", fr: "Rechercher", es: "Buscar", en: "Search", he: "חיפוש", de: "Suchen" },
  };

  const getText = (key, params = {}) => {
    let text = textMap[key][uiLang] || textMap[key].en;
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(`{${param}}`, value);
    });
    return text;
  };

  const toggleMobileMenu = () => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearchMenu = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const cartLength = cart?.items.length > 0 ? cart?.items.length : 0;
  const cartTotal = cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  const isActiveLink = (href) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const activeClass = "text-[#fd3d57] font-semibold";
  const inactiveClass = "text-gray-700 hover:text-[#fd3d57] transition-colors duration-300";

  return (
    <div className="bg-white">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`flex items-center justify-between h-16 py-2 ${isRtl ? "flex-row-reverse lg:flex-row-reverse" : "flex-row-reverse lg:flex-row"}`}>

            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden bg-[#fd3d57] w-8 h-8 rounded flex items-center justify-center text-white order-1 lg:order-none ${isRtl ? "ml-auto lg:ml-0" : "mr-auto lg:mr-0"}`}
              aria-label="Menu"
            >
              <ThreeDotIcon />
            </button>

            <Link href="/" className="hidden lg:flex items-center">
              <Image
                src={logo}
                alt="HDO Logo"
                width={150}
                height={150}
                priority
                sizes="120px"
                className="relative z-10 flex items-center justify-center h-[90px] w-[120px] object-contain p-0 m-0"
              />
            </Link>

            <nav className={`hidden lg:flex items-center gap-6 ${isRtl ? "text-right" : ""}`}>
              <Link href="/" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("home")}</Link>
              <Link href="/shop" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/shop") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("store")}</Link>
              <Link href="/about" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/about") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("aboutUs")}</Link>
              <Link href="/contact" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/contact") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("contactUs")}</Link>
            </nav>

            <div className="hidden lg:flex items-center">
              <div className="flex h-16 w-[400px]" dir="ltr">
                <input
                  type="text"
                  placeholder={isRtl ? "חיפוש..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`h-full flex-1 border border-gray-300 text-base text-black focus:outline-none focus:ring-0 focus:border-gray-300 ${isRtl ? "order-2 pr-6 pl-4 text-right rounded-r-2xl rounded-l-none" : "order-1 pl-6 pr-4 text-left rounded-l-2xl rounded-r-none"}`}
                  dir={isRtl ? "rtl" : "ltr"}
                  style={{
                    height: "56px", fontSize: "12px",
                    borderLeft: isRtl ? "none" : undefined, borderRight: isRtl ? undefined : "none",
                    borderTopLeftRadius: isRtl ? 0 : undefined, borderBottomLeftRadius: isRtl ? 0 : undefined,
                    borderTopRightRadius: isRtl ? undefined : 0, borderBottomRightRadius: isRtl ? undefined : 0,
                  }}
                />
                <button
                  onClick={handleSearch}
                  className={`px-5 bg-[#e91325] text-white text-base font-normal hover:bg-[#e02d47] transition-colors border border-gray-300 ${isRtl ? "order-1 rounded-l-2xl rounded-r-none border-r-0" : "order-2 rounded-r-2xl rounded-l-none border-l-0"}`}
                  style={{ height: "56px" }}
                >
                  {getText("search")}
                </button>
              </div>
            </div>

            {/* Cart only - flags removed from here, now in top bar */}
            <div className="flex items-center gap-3" dir="ltr">
              <Link href="/add-card" className="flex items-center gap-2 text-gray-800 hover:text-[#fd3d57] transition-colors relative">
                <CartIcon />
                <div className="block">
                  <div className="text-base font-bold">€ {cartTotal.toFixed(2)}</div>
                </div>
                {cartLength >= 0 && (
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fd3d57] text-xs text-white">
                    {cartLength}
                  </div>
                )}
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-white text-gray-800 z-50 flex flex-col items-center transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
      >
        {/* Logo + close button */}
        <div className="w-full flex items-start justify-between pt-2 pb-2 px-6 relative">
          <Link href="/" onClick={toggleMobileMenu} className="flex items-center">
            <Image src={logo} alt="HDO Logo" width={220} height={180} priority className="object-contain h-[150px] w-[200px]" />
          </Link>
          <button onClick={toggleMobileMenu} className="text-2xl text-gray-700 hover:text-[#fd3d57] focus:outline-none mt-2 ml-2" aria-label="Close menu">&times;</button>
        </div>

        {/* Language switcher flags — visible only on mobile */}
        <div className="w-full px-8 py-3 border-b border-gray-100">
          <LanguageSwitcher />
        </div>

        {/* Nav links */}
        <div className="pt-4 flex flex-col gap-2 w-full px-8 text-gray-600">
          <Link href="/" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("home")}</Link>
          <Link href="/shop" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/shop") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("store")}</Link>
          <Link href="/about" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/about") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("aboutUs")}</Link>
          <Link href="/contact" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/contact") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("contactUs")}</Link>
        </div>

        {/* Mobile search */}
        <div className="pt-4 flex flex-col gap-2 w-full px-8 text-gray-600">
          <div className="flex w-full h-16 mt-2">
            <input type="text" placeholder="Search ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKeyPress}
              className="flex-1 h-full pl-6 pr-4 border-2 border-gray-400 rounded-l-2xl rounded-r-none text-base text-black focus:outline-none focus:ring-0 focus:border-gray-400"
              style={{ height: '56px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: "16px" }} />
            <button onClick={handleSearch} className="px-7 bg-[#e91325] text-white rounded-r-2xl rounded-l-none text-base font-semibold hover:bg-[#e02d47] transition-colors border border-gray-300 border-l-0"
              style={{ height: '56px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
              {getText("search")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import Link from "next/link";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import Search from "./Search";
// import Image from "next/image";
// import { useState } from "react";
// import {
//   AngelDownIcon,
//   CartIcon,
//   SearchIcon,
//   ThreeDotIcon,
// } from "@/public/icons/icons";
// import { useCart } from "@/providers/CartContext";
// import { useDomain } from "@/providers/useDomain";
// import { getUiLanguage } from "@/utils/uiLanguage";
// import logo from "@/public/client/logo.png";

// export default function Header() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { cart } = useCart();
//   const cartLengths = cart?.items?.length || 0;
//   const lang = useDomain();
//   const uiLang = getUiLanguage(lang);
//   const isRtl = uiLang === "he";

//   const textMap = {
//     home: { pt: "Início", fr: "Accueil", es: "Inicio", en: "Home", he: "בית", de: "Startseite" },
//     store: { pt: "Loja", fr: "Boutique", es: "Tienda", en: "Store", he: "חנות", de: "Shop" },
//     aboutUs: { pt: "Sobre N׳s", fr: "À Propos", es: "Sobre Nosotros", en: "About Us", he: "אודותינו", de: "Über uns" },
//     contactUs: { pt: "Contato", fr: "Contact", es: "Contacto", en: "Contact Us", he: "צור קשר", de: "Kontakt" },
//     cart: { pt: "Carrinho", fr: "Panier", es: "Carrito", en: "Cart", he: "עגלת קניות", de: "Warenkorb" },
//     search: { pt: "Pesquisar", fr: "Rechercher", es: "Buscar", en: "Search", he: "חיפוש", de: "Suchen" },
//   };

//   const getText = (key, params = {}) => {
//     let text = textMap[key][uiLang] || textMap[key].en;
//     Object.entries(params).forEach(([param, value]) => {
//       text = text.replace(`{${param}}`, value);
//     });
//     return text;
//   };

//   const toggleMobileMenu = () => {
//     setIsSearchOpen(false);
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   const toggleSearchMenu = () => {
//     setIsMobileMenuOpen(false);
//     setIsSearchOpen((prev) => !prev);
//   };

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
//     } else {
//       router.push("/shop");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const cartLength = cart?.items.length > 0 ? cart?.items.length : 0;
//   const cartTotal = cart?.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

//   const isActiveLink = (href) => {
//     if (href === "/") return pathname === href;
//     return pathname.startsWith(href);
//   };

//   const activeClass = "text-[#fd3d57] font-semibold";
//   const inactiveClass = "text-gray-700 hover:text-[#fd3d57] transition-colors duration-300";

//   return (
//     <div className="bg-white">
//       <header className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className={`flex items-center justify-between h-16 py-2 ${isRtl ? "flex-row-reverse lg:flex-row-reverse" : "flex-row-reverse lg:flex-row"}`}>

//             <button
//               onClick={toggleMobileMenu}
//               className={`lg:hidden bg-[#fd3d57] w-8 h-8 rounded flex items-center justify-center text-white order-1 lg:order-none ${isRtl ? "ml-auto lg:ml-0" : "mr-auto lg:mr-0"}`}
//               aria-label="Menu"
//             >
//               <ThreeDotIcon />
//             </button>

//             <Link href="/" className="hidden lg:flex items-center">
//               <Image
//                 src={logo}
//                 alt="HDO Logo"
//                 width={150}
//                 height={150}
//                 priority
//                 className="relative z-10 flex items-center justify-center h-[90px] w-[120px] object-contain p-0 m-0"
//                 style={{ minWidth: 140, minHeight: 140 }}
//               />
//             </Link>

//             <nav className={`hidden lg:flex items-center gap-6 ${isRtl ? "text-right" : ""}`}>
//               <Link href="/" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("home")}</Link>
//               <Link href="/shop" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/shop") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("store")}</Link>
//               <Link href="/about" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/about") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("aboutUs")}</Link>
//               <Link href="/contact" className={`text-gray-500 hover:text-[#fd3d57] hover:underline transition-colors duration-200 font-medium ${isActiveLink("/contact") ? "text-[#fd3d57]" : ""}`} style={{ fontSize: "18px", fontFamily: "Lato, sans-serif" }}>{getText("contactUs")}</Link>
//             </nav>

//             <div className="hidden lg:flex items-center">
//               <div className="flex h-16 w-[400px]" dir="ltr">
//                 <input
//                   type="text"
//                   placeholder={isRtl ? "חיפוש..." : "Search..."}
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   className={`h-full flex-1 border border-gray-300 text-base text-black focus:outline-none focus:ring-0 focus:border-gray-300 ${isRtl ? "order-2 pr-6 pl-4 text-right rounded-r-2xl rounded-l-none" : "order-1 pl-6 pr-4 text-left rounded-l-2xl rounded-r-none"}`}
//                   dir={isRtl ? "rtl" : "ltr"}
//                   style={{
//                     height: "56px", fontSize: "12px",
//                     borderLeft: isRtl ? "none" : undefined, borderRight: isRtl ? undefined : "none",
//                     borderTopLeftRadius: isRtl ? 0 : undefined, borderBottomLeftRadius: isRtl ? 0 : undefined,
//                     borderTopRightRadius: isRtl ? undefined : 0, borderBottomRightRadius: isRtl ? undefined : 0,
//                   }}
//                 />
//                 <button
//                   onClick={handleSearch}
//                   className={`px-5 bg-[#e91325] text-white text-base font-normal hover:bg-[#e02d47] transition-colors border border-gray-300 ${isRtl ? "order-1 rounded-l-2xl rounded-r-none border-r-0" : "order-2 rounded-r-2xl rounded-l-none border-l-0"}`}
//                   style={{ height: "56px" }}
//                 >
//                   {getText("search")}
//                 </button>
//               </div>
//             </div>

//             {/* Cart only - flags removed from here, now in top bar */}
//             <div className="flex items-center gap-3" dir="ltr">
//               <Link href="/add-card" className="flex items-center gap-2 text-gray-800 hover:text-[#fd3d57] transition-colors relative">
//                 <CartIcon />
//                 <div className="block">
//                   <div className="text-base font-bold">€ {cartTotal.toFixed(2)}</div>
//                 </div>
//                 {cartLength >= 0 && (
//                   <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fd3d57] text-xs text-white">
//                     {cartLength}
//                   </div>
//                 )}
//               </Link>
//             </div>

//           </div>
//         </div>
//       </header>

//       <div
//         className={`lg:hidden fixed top-0 left-0 h-full w-full bg-white text-gray-800 z-50 flex flex-col items-center transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}`}
//       >
//         <div className="w-full flex items-start justify-between pt-2 pb-2 px-6 relative">
//           <Link href="/" onClick={toggleMobileMenu} className="flex items-center">
//             <Image src={logo} alt="HDO Logo" width={220} height={180} priority className="object-contain h-[150px] w-[200px]" style={{ minWidth: 180, minHeight: 180 }} />
//           </Link>
//           <button onClick={toggleMobileMenu} className="text-2xl text-gray-700 hover:text-[#fd3d57] focus:outline-none mt-2 ml-2" aria-label="Close menu">&times;</button>
//         </div>
//         <div className="pt-4 flex flex-col gap-2 w-full px-8 text-gray-600">
//           <Link href="/" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("home")}</Link>
//           <Link href="/shop" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/shop") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("store")}</Link>
//           <Link href="/about" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/about") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("aboutUs")}</Link>
//           <Link href="/contact" className={`block text-lg font-light px-1 py-4 rounded hover:text-[#fd3d57] transition-colors ${isActiveLink("/contact") ? "font-medium text-gray-600" : "text-gray-600"}`} onClick={toggleMobileMenu}>{getText("contactUs")}</Link>
//         </div>
//         <div className="pt-4 flex flex-col gap-2 w-full px-8 text-gray-600">
//           <div className="flex w-full h-16 mt-2">
//             <input type="text" placeholder="Search ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={handleKeyPress}
//               className="flex-1 h-full pl-6 pr-4 border-2 border-gray-400 rounded-l-2xl rounded-r-none text-base text-black focus:outline-none focus:ring-0 focus:border-gray-400"
//               style={{ height: '56px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: "16px" }} />
//             <button onClick={handleSearch} className="px-7 bg-[#e91325] text-white rounded-r-2xl rounded-l-none text-base font-semibold hover:bg-[#e02d47] transition-colors border border-gray-300 border-l-0"
//               style={{ height: '56px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
//               {getText("search")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
