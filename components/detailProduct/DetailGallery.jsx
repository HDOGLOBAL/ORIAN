import Image from "next/image";
export default function DetailGallery({ images }) {
  const newImages = [...images];
  newImages.shift();

  return (
    <div>
      <Image
        src={images[0]}
        alt="product 1"
        className="w-full"
        width={300}
        height={200}
      />

      <div className="grid grid-cols-5 gap-4 mt-4">
        {newImages.map((image) => (
          <>
            <Image
              src={image}
              alt={image}
              className="w-full"
              width={200}
              height={200}
            />
          </>
        ))}
      </div>
    </div>
  );
}
