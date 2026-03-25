import Image from "next/image";
import { ExhibitionCategories } from "@/components/ExhibitionCategories";
import { siteImages } from "@/lib/site-images";

export default function ExhibitorsPage() {
  const stripImages = [
    siteImages.dsc5363,
    siteImages.dsc4621,
    siteImages.dsc5127,
    siteImages.dsc5133,
    siteImages.dsc5158,
  ];

  return (
    <div>
      <ExhibitionCategories />
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-deepBlue font-poppins">Exhibitor Field & Demo Moments</h2>
            <p className="text-gray-600 mt-3 font-inter">
              Crop demonstrations, mechanization showcases, and livestock participation across ABTF categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {stripImages.map((image) => (
              <div key={image.src} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={900}
                  height={600}
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="w-full h-52 object-cover"
                  style={{ objectPosition: image.objectPosition || "center" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
