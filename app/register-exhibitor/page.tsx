import Link from "next/link";
import Image from "next/image";
import { StoreIcon, NetworkIcon, TrendingUpIcon, Clock3Icon } from "lucide-react";
import { siteImages } from "@/lib/site-images";

export default function ExhibitorWelcomePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="relative h-56 sm:h-72">
                        <Image
                            src={siteImages.uoe002.src}
                            alt={siteImages.uoe002.alt}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-deepBlue/55" />
                    </div>
                    <div className="bg-deepBlue px-6 sm:px-10 py-8 sm:py-10 text-white">
                        <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-gold font-semibold mb-2">ABTF 2026 Exhibitor Program</p>
                        <h1 className="text-3xl sm:text-4xl font-bold font-poppins">Welcome, Prospective Exhibitor</h1>
                        <p className="mt-3 text-gray-200 max-w-3xl font-inter">
                            The University of Eldoret Agri-Business Trade Fair (ABTF) is a premier platform for showcasing products,
                            technologies, and services to farmers, distributors, corporate buyers, development partners, and policy stakeholders.
                            Exhibiting at ABTF gives your organization direct market visibility and practical opportunities for growth.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                                <h2 className="text-lg font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                    <StoreIcon className="h-5 w-5 text-maroon" /> What It Means to Exhibit
                                </h2>
                                <p className="text-gray-700 text-sm leading-6">
                                    Exhibitors present solutions and products across key agricultural sectors, engage with qualified visitors,
                                    and build commercial relationships with buyers and partners.
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                                <h2 className="text-lg font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                    <NetworkIcon className="h-5 w-5 text-maroon" /> Visibility and Networking
                                </h2>
                                <p className="text-gray-700 text-sm leading-6">
                                    Participation increases brand exposure, opens pathways to strategic collaboration, and places your
                                    organization in direct conversation with key actors in the agriculture value chain.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <h3 className="text-base font-bold text-blue-900 font-poppins mb-2">Nominated Company Representative</h3>
                            <p className="text-sm text-blue-900 leading-6">
                                Registration must be completed by a nominated representative from your company. The account created
                                becomes your official company contact and will manage registration information, booth bookings,
                                payment follow-up, and ABTF communications.
                            </p>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <h3 className="text-base font-bold text-amber-900 font-poppins mb-2 flex items-center gap-2">
                                <Clock3Icon className="h-5 w-5" /> Booth Reservation Timeline
                            </h3>
                            <p className="text-sm text-amber-900 leading-6">
                                Selected booths are reserved for 7 days only. Payment must be completed within this period to confirm
                                the booking. Unpaid reservations will expire automatically and the booth will become available again.
                            </p>
                        </div>

                        <div className="rounded-xl border border-maroon/25 bg-maroon/5 p-5">
                            <h3 className="text-base font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                <TrendingUpIcon className="h-5 w-5 text-maroon" /> Register Early
                            </h3>
                            <p className="text-sm text-gray-700 leading-6">
                                Early registration improves your chance of securing preferred booth locations and helps your team
                                complete invoicing and payment milestones on schedule.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/register-exhibitor/form"
                                className="inline-flex w-full sm:w-auto justify-center bg-maroon hover:bg-gold text-white font-bold px-8 py-3.5 rounded-lg transition-colors duration-300"
                            >
                                Proceed to Exhibitor Registration
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
