import Image from "next/image";
import {
  LightbulbIcon,
  UsersIcon,
  CpuIcon,
  MicroscopeIcon,
} from "lucide-react";
import { siteImages } from "@/lib/site-images";

export function EventHighlights() {
  const highlights = [
    {
      title: "Innovation Demonstrations",
      description:
        "Live showcases of groundbreaking agricultural methods and tools.",
      icon: <LightbulbIcon className="h-8 w-8 text-gold" />,
      image: siteImages.dsc4907,
    },
    {
      title: "Agribusiness Networking",
      description: "Connect with investors, buyers, and industry leaders.",
      icon: <UsersIcon className="h-8 w-8 text-gold" />,
      image: siteImages.dsc4992,
    },
    {
      title: "Agricultural Technology",
      description: "Explore precision farming, drones, and smart irrigation.",
      icon: <CpuIcon className="h-8 w-8 text-gold" />,
      image: siteImages.dsc5158,
    },
    {
      title: "Research Showcases",
      description:
        "Discover the latest findings from University of Eldoret scholars.",
      icon: <MicroscopeIcon className="h-8 w-8 text-gold" />,
      image: siteImages.dsc5510,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="rounded-lg overflow-hidden mb-5 border border-gray-200">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={800}
                  height={500}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="w-full h-36 object-cover"
                  style={{ objectPosition: item.image.objectPosition || "center" }}
                />
              </div>
              <div className="w-16 h-16 bg-deepBlue rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-deepBlue font-poppins mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 font-inter">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
