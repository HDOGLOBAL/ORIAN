import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { getLanguageFromHost } from "@/utils/seoMetadata";

export const metadata = {
  title: "Page Not Found | HDO Trade",
  description: "The page you were looking for does not exist. Browse our spare parts shop.",
  robots: { index: false, follow: true },
};

const notFoundTranslations = {
  en: { title: "Page Not Found", text: "The page you were looking for does not exist", btn: "Return Home" },
  pt: { title: "Página Não Encontrada", text: "A página que procurava não existe", btn: "Voltar ao Início" },
  fr: { title: "Page Non Trouvée", text: "La page que vous recherchiez n'existe pas", btn: "Retour à l'Accueil" },
  es: { title: "Página No Encontrada", text: "La página que buscas no existe", btn: "Volver al Inicio" },
  de: { title: "Seite Nicht Gefunden", text: "Die gesuchte Seite existiert nicht", btn: "Zurück zur Startseite" },
  he: { title: "הדף לא נמצא", text: "הדף שחיפשתם לא קיים", btn: "חזרה לדף הבית" },
  it: { title: "Pagina Non Trovata", text: "La pagina che stai cercando non esiste", btn: "Torna alla Home" },
};

export default async function NotFound() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const lang = getLanguageFromHost(host);
  const t = notFoundTranslations[lang] || notFoundTranslations.en;

  return (
    <div className="text-black bg-white">
      <div className="flex">
        <div className="m-auto text-center">
          <div>
            <Image
              width={600}
              height={400}
              src="/404.svg"
              alt={t.title}
            />
          </div>
          <p className="text-sm md:text-base text-slade-500 p-2 mb-4">
            {t.text}
          </p>
          <Link
            className="bg-transparent hover:bg-[#eb4a36]
                         text-red-500 hover:text-white rounded 
                         shadow hover:shadow-lg py-2 px-4 border border-[#eb4a36]
                         hover:border-transparent"
            href="/"
          >
            {t.btn}
          </Link>
        </div>
      </div>
    </div>
  );
}
