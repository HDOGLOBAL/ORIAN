import Link from "next/link";
export default function Breadcrumb({ pageName }) {
  return (
    <div className="container py-4 flex items-center gap-3">
      <Link href="/" className="text-primary text-base">
        <i className="fa-solid fa-house"></i>
      </Link>
      <span className="text-sm text-gray-400">
        <i className="fa-solid fa-chevron-right"></i>
      </span>
      <p className="text-gray-600 font-medium uppercase">{pageName}</p>
    </div>
  );
}
