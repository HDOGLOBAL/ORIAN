import ChatButton from "@/components/chatbot/ChatButton";
import CountrySelectorModal from "@/components/clients/CountryModal";
import FilterC from "@/components/clients/FilterC";
import ProductQuery from "@/components/clients/ProductQuery";
import Loading from "@/components/common/Loading";
import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";

import { Suspense } from "react";

const decordedFilterCat = (filCat) => {
  const decorded = decodeURI(filCat);
  if (decorded === "undefined") {
    return "";
  }
  return decorded;
};

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("store", lang, domain);
}

export default async function page(props) {
  const searchParams = await props.searchParams;
  const { search, manufacturer, category, page, subcategory } = searchParams;

  const decodedManufacturer = decordedFilterCat(manufacturer);
  const decodedCategory = decordedFilterCat(category);
  const decodedPage = decordedFilterCat(page || 1);
  const decodedSubcategory = decordedFilterCat(subcategory);

  return (
    <div className="w-full max-w-[1440px] mx-auto bg-[#ffffff] relative">
      <div className="absolute top-4 right-4 z-30">
        <CountrySelectorModal />
      </div>

      <div className="container pt-4 pb-16 items-start">
        <FilterC />
        <Suspense fallback={<Loading />}>
          <ProductQuery
            search={search}
            manufacturerId={decodedManufacturer}
            categoryId={decodedCategory}
            subcategoryId={decodedSubcategory}
            page={decodedPage}
          />
        </Suspense>
      </div>
      <ChatButton/>
    </div>
  );
}
