"use client";
import Image from "next/image";
import { useState } from "react";

export default function DetailGallery({ images = [] }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [selected, setSelected] = useState(0);

  if (safeImages.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative w-full aspect-square overflow-hidden rounded border">
        <Image
          src={safeImages[selected]}
          alt={`Product image ${selected + 1}`}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {safeImages.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(idx)}
              className={`relative w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 transition-all ${
                idx === selected
                  ? "border-blue-500"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
