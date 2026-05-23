import ChatButton from "@/components/chatbot/ChatButton";
import Banner2 from "@/components/clients/Banner2";
import ButtonImg from "@/components/clients/ButtonImg";
import FeaturedCategories from "@/components/clients/FeaturesCat";
import FilterC from "@/components/clients/FilterC";
import ImageBanners from "@/components/clients/ImageBanner";
import Banner from "@/components/home/Banner";
import FeatureIcons from "@/components/home/FeatureIcons";
import TrustBadges from "@/components/home/TrustBadges";
import FAQSchema from "@/components/seo/FAQSchema";
import Image from "next/image";
import aboutImg from "@/public/client/about.png";
import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";
import { getFeaturedCategories } from "@/database/queries";

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("home", lang, domain);
}

export default async function Home() {
  const lang = await getRequestLanguage();
  const categories = await getFeaturedCategories().catch(() => []);
  return (
    <>
      <FAQSchema lang={lang} />
      <div className="w-full max-w-[1440px] mx-auto bg-[#ffffff] px-4">
        <FilterC />
        <Banner />
        <FeatureIcons />
        <ButtonImg />
        <ImageBanners />
        <FeaturedCategories initialCategories={categories} />
        <Banner2 />
        <TrustBadges />
        <div className="w-full max-w-[900px] mx-auto my-8 px-4">
          <Image
            src={aboutImg}
            alt="HDO Global Trade — Equal Quality at Better Price"
            className="w-full h-auto rounded-xl shadow-md"
            unoptimized
          />
        </div>
        <ChatButton />
      </div>
    </>
  );
}
