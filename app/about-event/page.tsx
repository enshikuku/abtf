import Image from "next/image";
import { AboutEvent } from "@/components/AboutEvent";
import { siteImages } from "@/lib/site-images";

export default function AboutEventPage() {
  return (
    <div>
      <section className="relative h-[48vh] min-h-[340px] overflow-hidden">
        <Image
          src={siteImages.dsc4992.src}
          alt={siteImages.dsc4992.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: siteImages.dsc4992.objectPosition || "center" }}
        />
        <div className="absolute inset-0 bg-deepBlue/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins">About the Event</h1>
            <p className="text-gray-200 mt-4 max-w-2xl font-inter text-lg">
              A documentary view of ceremony, demonstrations, innovation, livestock, and community participation at ABTF.
            </p>
          </div>
        </div>
      </section>
      <AboutEvent />
    </div>
  );
}
