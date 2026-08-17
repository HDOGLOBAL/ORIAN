"use client";

import { AddToWishlist } from "@/database/queries";
import { serverRevalidate } from "@/utils/serverRev";
import { toast } from "react-toastify";

const wishlistTexts = {
  en: { added: "Added to the wishlist", already: "Already in wishlist", login: "Login please" },
  pt: { added: "Adicionado à lista de desejos", already: "Já está na lista de desejos", login: "Faça login por favor" },
  fr: { added: "Ajouté à la liste de souhaits", already: "Déjà dans la liste de souhaits", login: "Veuillez vous connecter" },
  es: { added: "Añadido a la lista de deseos", already: "Ya está en la lista de deseos", login: "Por favor, inicie sesión" },
  he: { added: " נוסף לרשימת המשאלות", already: "כבר ברשימת המשאלות", login: "אנא התחבר" },
  de: { added: "Zur Wunschliste hinzugefügt", already: "Bereits auf der Wunschliste", login: "Bitte anmelden" },
  it: { added: "Aggiunto ai preferiti", already: "Già nei preferiti", login: "Accedi per favore" },
};

export default function Addwish({ productId, userId, fromDetail, lan }) {
  const t = wishlistTexts[lan] || wishlistTexts.en;
  const handleClick = async () => {
    if (userId) {
      const mess = await AddToWishlist(userId, productId);
      if (mess) {
        toast.success(t.added, {
          position: "bottom-right",
        });
      } else {
        toast.info(t.already, {
          position: "bottom-right",
        });
      }
      await serverRevalidate();
    } else {
      toast.error(t.login, {
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      {!fromDetail ? (
        <p
          onClick={handleClick}
          className="text-white text-lg w-9 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-gray-800 transition"
          title="add to wishlist"
        >
          <i className="fa-solid fa-heart"></i>
        </p>
      ) : (
        <button
          onClick={handleClick}
          className="border border-gray-300 text-gray-600 px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition"
        >
          <i className="fa-solid fa-heart"></i> {lan}
        </button>
      )}
    </>
  );
}
