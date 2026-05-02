import CountrySelector from "@/components/clients/CountryModal";
import ProductPage from "@/components/clients/ProductCartC";
import RelatedProduct from "@/components/detailProduct/RelatedProduct";
import ProductSchema from "@/components/seo/ProductSchema";
import { getProductById } from "@/database/queries";
import { getCurrency } from "@/utils/getCookieServer";
import { SupportStatusProvider } from "@/providers/SupportStatusProvider";
import {
  getLocalizedProductSeo,
  getRequestLanguage,
  getRequestHost,
  getDomainFromHost,
} from "@/utils/seoMetadata";
import { getExchangeRates } from "@/utils/getExchangeRates";

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;
  const lang = await getRequestLanguage();
  const host = await getRequestHost();
  const domain = getDomainFromHost(host);
  const product = await getProductById(id);

  return getLocalizedProductSeo(product, lang, domain);
}

export default async function page(props) {
  const params = await props.params;
  const { id } = params;

  const [product, currency, lang, rates, host] = await Promise.all([
    getProductById(id),
    getCurrency(),
    getRequestLanguage(),
    getExchangeRates(),
    getRequestHost(),
  ]);

  const domain = getDomainFromHost(host);

  return (
    <SupportStatusProvider>
      <ProductSchema product={product} currency={currency} lang={lang} domain={domain} />
      <CountrySelector />
      <div>
        <ProductPage product={product} currency={currency} lang={lang} rates={rates} />
        <RelatedProduct category={product?.categoryId} />
      </div>
    </SupportStatusProvider>
  );
}
