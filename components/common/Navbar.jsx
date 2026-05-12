// import Header from "./Header";

// export default async function Navbar({ language, langCode }) {
//   return (
//     <div className="sticky top-0 left-0 z-50">
//       <Header language={language} langCode={langCode} />
//     </div>
//   );
// }

import Header from "./Header";

export default async function Navbar({ language, langCode }) {
  return (
    <div className="sticky top-0 left-0 z-50">
      <Header language={language} langCode={langCode} />
    </div>
  );
}
 