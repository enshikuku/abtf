import Link from "next/link";
import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export function Sponsors() {
  const sponsorHighlights = [
    siteImages.dsc5095,
    siteImages.dsc4573,
    siteImages.dsc5133,
    siteImages.dsc5025,
  ];

  return (
    <section id="sponsors" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deepBlue font-poppins mb-4">
            Our Sponsors &amp; Partners
          </h2>
          <div className="w-24 h-1.5 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto">
            We are grateful for the support of our industry partners who make
            this event possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {sponsorHighlights.map((image) => (
            <div key={image.src} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src={image.src}
                alt={image.alt}
                width={900}
                height={600}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="w-full h-44 object-cover"
                style={{ objectPosition: image.objectPosition || "center" }}
              />
            </div>
          ))}
        </div>

        {/* Platinum Sponsors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-slate-700 font-poppins mb-8">
            Platinum Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2].map((i) => (
              <div
                key={`platinum-${i}`}
                className="w-72 h-36 bg-gray-50 border border-slate-200 rounded-xl shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-gray-400 font-inter font-medium text-lg">Logo Placeholder</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Sponsors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gold font-poppins mb-8">
            Gold Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={`gold-${i}`}
                className="w-64 h-32 bg-gray-50 border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-gray-400 font-inter font-medium text-lg">
                  Logo Placeholder
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Silver Sponsors */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-center text-gray-400 font-poppins mb-8">
            Silver Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`silver-${i}`}
                className="w-48 h-24 bg-gray-50 border border-gray-100 rounded-lg shadow-sm flex items-center justify-center p-4 hover:shadow-md transition-shadow"
              >
                <div className="text-gray-400 font-inter font-medium text-sm">
                  Logo Placeholder
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bronze Sponsors */}
        <div>
          <h3 className="text-lg font-bold text-center text-orange-700 font-poppins mb-8">
            Bronze Sponsors
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={`bronze-${i}`}
                className="w-36 h-20 bg-gray-50 border border-gray-100 rounded-lg shadow-sm flex items-center justify-center p-3 hover:shadow-md transition-shadow"
              >
                <div className="text-gray-400 font-inter font-medium text-xs">
                  Logo Placeholder
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/register-sponsor"
            className="bg-transparent border-2 border-deepBlue text-deepBlue hover:bg-deepBlue hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 inline-block"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </section>
  );
}
