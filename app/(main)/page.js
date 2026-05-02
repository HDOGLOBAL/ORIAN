import ChatButton from "@/components/chatbot/ChatButton";
import Banner2 from "@/components/clients/Banner2";
import ButtonImg from "@/components/clients/ButtonImg";
import FeaturedCategories from "@/components/clients/FeaturesCat";
import FilterC from "@/components/clients/FilterC";
import ImageBanners from "@/components/clients/ImageBanner";
import OurBrand from "@/components/clients/OurBrand";
import Banner from "@/components/home/Banner";
import {
  getRequestLanguage,
  getSeoMetadata,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";

export async function generateMetadata() {
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);

  return getSeoMetadata("home", lang, domain);
}

export default async function Home() {
  return (
    <div className="w-full max-w-[1440px] mx-auto bg-[#ffffff] px-4">
      <FilterC />
      <Banner />
      <ImageBanners />
      <ButtonImg />
      <FeaturedCategories />
      <Banner2 />
      <OurBrand />
      <ChatButton />
    </div>
  );
}
