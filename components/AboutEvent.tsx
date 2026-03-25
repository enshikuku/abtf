import Image from "next/image";
import { CheckCircle2Icon } from "lucide-react";
import { aboutEventGallery, siteImages } from "@/lib/site-images";

export function AboutEvent() {
  const highlights = [
    "Agricultural innovation showcase",
    "Machinery and equipment demonstrations",
    "Crop and livestock exhibitions",
    "Agribusiness networking and partnerships",
    "Expert panel discussions and workshops",
    "Student research presentations",
  ];

  return (
    <section id="about-event" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-6">
              About the Trade Fair
            </h2>
            <div className="w-20 h-1.5 bg-gold mb-8"></div>

            <p className="text-lg text-gray-700 font-inter mb-6 leading-relaxed">
              The University of Eldoret Agri-Business Trade Fair is a premier
              annual event that brings together industry leaders, farmers,
              researchers, and students to showcase the latest advancements in
              agricultural technology and business practices.
            </p>

            <p className="text-lg text-gray-700 font-inter mb-8 leading-relaxed">
              Our mission is to bridge the gap between academic research and
              practical farming applications, fostering an environment where
              innovation thrives and sustainable agricultural solutions are
              developed for the future.
            </p>

            <div className="space-y-4">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2Icon className="h-6 w-6 text-maroon mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 font-medium font-inter">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button className="text-maroon font-semibold hover:text-gold transition-colors flex items-center group">
                Download Event Brochure
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Feature image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gold/10 rounded-2xl transform rotate-3"></div>
            <Image
              src={siteImages.dsc4992.src}
              alt={siteImages.dsc4992.alt}
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="relative rounded-2xl shadow-xl w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              style={{ objectPosition: siteImages.dsc4992.objectPosition || "center" }}
            />

            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -left-8 bg-deepBlue text-white p-6 rounded-xl shadow-2xl border border-white/10 hidden md:block">
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-gold font-poppins">
                    50+
                  </p>
                  <p className="text-sm text-gray-300 font-inter">Exhibitors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gold font-poppins">
                    10k+
                  </p>
                  <p className="text-sm text-gray-300 font-inter">Attendees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-deepBlue font-poppins">
              Event Story in Pictures
            </h3>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto font-inter">
              From opening ceremony and field demonstrations to technology showcases, livestock, and culture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutEventGallery.map((photo, index) => (
              <div
                key={photo.src}
                className={`${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""} rounded-xl overflow-hidden border border-gray-200 shadow-sm`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={800}
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                  className={`w-full ${index === 0 ? "h-[300px] sm:h-[420px]" : "h-52"} object-cover`}
                  style={{ objectPosition: photo.objectPosition || "center" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
