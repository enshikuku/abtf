import Link from "next/link";
import { Building2Icon, HandshakeIcon, MegaphoneIcon, Clock3Icon } from "lucide-react";

export default function SponsorWelcomePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="bg-deepBlue px-6 sm:px-10 py-8 sm:py-10 text-white">
                        <p className="uppercase tracking-[0.18em] text-xs sm:text-sm text-gold font-semibold mb-2">ABTF 2026 Sponsorship</p>
                        <h1 className="text-3xl sm:text-4xl font-bold font-poppins">Welcome, Prospective Sponsor</h1>
                        <p className="mt-3 text-gray-200 max-w-3xl font-inter">
                            The University of Eldoret Agri-Business Trade Fair (ABTF) brings together agribusiness leaders,
                            innovators, investors, policy makers, and producers from across the region. Sponsorship positions
                            your brand at the center of meaningful conversations, strategic partnerships, and commercial growth.
                        </p>
                    </div>

                    <div className="p-6 sm:p-8 md:p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                                <h2 className="text-lg font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                    <MegaphoneIcon className="h-5 w-5 text-maroon" /> Why Sponsor ABTF
                                </h2>
                                <p className="text-gray-700 text-sm leading-6">
                                    Gain high-value visibility, connect with decision-makers, and strengthen your reputation as a
                                    partner in agricultural innovation, sustainability, and market development.
                                </p>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                                <h2 className="text-lg font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                    <HandshakeIcon className="h-5 w-5 text-maroon" /> Business Value
                                </h2>
                                <p className="text-gray-700 text-sm leading-6">
                                    Sponsorship supports direct engagement with exhibitors and attendees, providing opportunities for
                                    brand placement, lead generation, strategic networking, and long-term collaborations.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                            <h3 className="text-base font-bold text-amber-900 font-poppins mb-2">Sponsor Categories</h3>
                            <p className="text-sm text-amber-900 leading-6">
                                Sponsorship categories are Platinum, Gold, Silver, and Bronze. You will select your preferred
                                category at the beginning of registration, and only booths assigned to that category will be shown
                                during booth selection.
                            </p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                            <h3 className="text-base font-bold text-blue-900 font-poppins mb-2 flex items-center gap-2">
                                <Building2Icon className="h-5 w-5" /> Nominated Company Representative
                            </h3>
                            <p className="text-sm text-blue-900 leading-6">
                                Registration must be completed by a nominated representative from your organization. The account
                                created will serve as the official company contact responsible for managing registration details,
                                booth bookings, invoices, payment submissions, and ABTF communications.
                            </p>
                        </div>

                        <div className="rounded-xl border border-maroon/25 bg-maroon/5 p-5">
                            <h3 className="text-base font-bold text-deepBlue font-poppins mb-2 flex items-center gap-2">
                                <Clock3Icon className="h-5 w-5 text-maroon" /> Book Early
                            </h3>
                            <p className="text-sm text-gray-700 leading-6">
                                Sponsor booth allocations are limited and category-specific. Early registration improves access to
                                preferred placement and ensures timely processing of invoicing and payment confirmation.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/register-sponsor/form"
                                className="inline-flex w-full sm:w-auto justify-center bg-maroon hover:bg-gold text-white font-bold px-8 py-3.5 rounded-lg transition-colors duration-300"
                            >
                                Proceed to Sponsor Registration
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
