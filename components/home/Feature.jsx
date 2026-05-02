import Image from "next/image";

export default function Feature({ featureLang }) {
  return (
    <div className="w-[80%] mx-auto py-16">
      <div className="w-12/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <Image
            src="/assets/images/icons/delivery-van.svg"
            alt="product 1"
            className="w-12 h-12 object-contain"
            width={200}
            height={200}
          />
          <div>
            <h4 className="font-medium capitalize text-lg">
              {featureLang?.shipping}
            </h4>
            <p className="text-gray-500 text-sm">{featureLang?.order}</p>
          </div>
        </div>

        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <Image
            src="/assets/images/icons/money-back.svg"
            alt="product 1"
            className="w-12 h-12 object-contain"
            width={200}
            height={200}
          />
          <div>
            <h4 className="font-medium capitalize text-lg">
              {featureLang?.money}
            </h4>
            <p className="text-gray-500 text-sm">{featureLang?.return}</p>
          </div>
        </div>
        <div className="border border-primary rounded-sm px-3 py-6 flex justify-center items-center gap-5">
          <Image
            src="/assets/images/icons/service-hours.svg"
            alt="product 1"
            className="w-12 h-12 object-contain"
            width={200}
            height={200}
          />
          <div>
            <h4 className="font-medium capitalize text-lg">
              {featureLang?.support}
            </h4>
            <p className="text-gray-500 text-sm">{featureLang?.customer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
