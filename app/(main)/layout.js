import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// No metadata export here — each page exports its own via generateMetadata()
// Having a metadata export here was overwriting all page-level metadata with placeholder text

export default async function RootLayout(props) {
  const { children } = props;

  return (
    <>
      <Navbar sideMenu={true} />
      {children}
      <Footer />
    </>
  );
}
