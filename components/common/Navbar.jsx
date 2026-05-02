// import Header from "./Header";

// export default async function Navbar({ language, langCode }) {
//   return (
//     <div className="sticky top-0 left-0 z-50">
//       <Header language={language} langCode={langCode} />
//     </div>
//   );
// }

import Header from "./Header";
import LanguageSwitcher from "./LnagSwither";
 
export default async function Navbar({ language, langCode }) {
  return (
    <div className="sticky top-0 left-0 z-50">
      <div className="hidden lg:flex bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end items-center py-1">
          <LanguageSwitcher language={language} langCode={langCode} />
        </div>
      </div>
      <Header language={language} langCode={langCode} />
    </div>
  );
}
 