import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  TractorIcon,
  SproutIcon,
  PawPrintIcon,
  FactoryIcon,
  LandmarkIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LeafIcon,
} from "lucide-react";
import { siteImages } from "@/lib/site-images";
import { EXHIBITION_CATEGORIES } from "@/lib/exhibition-categories";

export function ExhibitionCategories() {
  type CategoryVisualImage = (typeof siteImages)[keyof typeof siteImages];

  const categoryVisuals: Record<string, { icon: ReactNode; image: CategoryVisualImage }> = {
    "agricultural-machinery": {
      icon: <TractorIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc4907,
    },
    "crops-and-seeds": {
      icon: <SproutIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc4573,
    },
    "livestock-and-animal-production": {
      icon: <PawPrintIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc5158,
    },
    "food-and-agro-processing": {
      icon: <FactoryIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc5363,
    },
    "agribusiness-finance-and-insurance": {
      icon: <LandmarkIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc5095,
    },
    "regulatory-research-and-learning-institutions": {
      icon: <GraduationCapIcon className="h-10 w-10 text-white" />,
      image: siteImages.uoe001,
    },
    "cooperatives-msmes-ngos-and-cbos": {
      icon: <HandshakeIcon className="h-10 w-10 text-white" />,
      image: siteImages.uoe002,
    },
    "environment-and-climate-smart-solutions": {
      icon: <LeafIcon className="h-10 w-10 text-white" />,
      image: siteImages.dsc5025,
    },
  };

  return (
    <section id="exhibitors" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-4">
            Exhibition Categories
          </h2>
          <div className="w-24 h-1.5 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            Discover a wide range of agricultural products, services, and
            innovations across our specialized exhibition zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {EXHIBITION_CATEGORIES.map((category) => (
            <div
              key={category.slug}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group"
            >
              <div
                className="bg-deepBlue relative h-48 p-6 flex justify-center items-center transition-colors duration-300 overflow-hidden"
              >
                <Image
                  src={categoryVisuals[category.slug]?.image.src || siteImages.dsc4907.src}
                  alt={categoryVisuals[category.slug]?.image.alt || category.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  style={{ objectPosition: categoryVisuals[category.slug]?.image.objectPosition || "center" }}
                />
                <div className="absolute inset-0 bg-deepBlue/65"></div>
                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {categoryVisuals[category.slug]?.icon}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-deepBlue font-poppins mb-3">
                  {category.name}
                </h3>
                <p className="text-gray-600 font-inter mb-6 flex-grow leading-relaxed text-sm">
                  {category.description}
                </p>
                <Link
                  href="/booths"
                  className="w-full py-2.5 rounded-md text-white font-medium transition-colors duration-300 bg-maroon hover:bg-gold text-center block"
                >
                  View Booths
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
