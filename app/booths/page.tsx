"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import {
  EXHIBITION_CATEGORIES,
  SPONSOR_SECTION_LABELS,
  getBoothSectionDisplay,
  getExhibitorSectionLabel,
} from "@/lib/exhibition-categories";
import { getBoothStatusTheme } from "@/lib/booth-status";

interface Booth {
  id: string;
  name: string;
  section: string;
  audience: "EXHIBITOR" | "SPONSOR";
  sponsorLevel: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | null;
  price: string;
  status: "AVAILABLE" | "RESERVED" | "PAYMENT_SUBMITTED" | "CONFIRMED";
}

export default function BoothsPage() {
  const router = useRouter();
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/booths")
      .then((r) => r.json())
      .then((data) => {
        setBooths(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load booths");
        setLoading(false);
      });
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPrice = booths
    .filter((b) => selected.has(b.id))
    .reduce((sum, b) => sum + Number(b.price), 0);

  const handleReserve = async () => {
    if (selected.size === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/booths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boothIds: Array.from(selected) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to reserve booths");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  };

  const sections = [
    ...EXHIBITION_CATEGORIES.map((category) => category.slug),
    ...Object.keys(SPONSOR_SECTION_LABELS),
  ].filter((section, index, arr) => arr.indexOf(section) === index);
  const isSponsorFlow = booths.some((b) => b.audience === "SPONSOR");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-deepBlue font-poppins mb-4">
            {isSponsorFlow ? "Sponsor Booth Selection" : "Exhibitor Booth Selection"}
          </h1>
          <p className="text-lg text-gray-600 font-inter max-w-2xl mx-auto mb-8">
            {isSponsorFlow
              ? "Select from sponsor-designated booths that match your registered sponsorship category."
              : "Select your preferred exhibition booths and generate your booking invoice."}
          </p>

          <div className="max-w-3xl mx-auto mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 text-left">
            Selected booths are reserved for 7 days only. Payment must be completed within this period to confirm
            the booking. Unpaid reservations will expire automatically and the booth will become available again.
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 bg-white py-3 sm:py-4 px-4 sm:px-8 rounded-full shadow-sm border border-gray-200">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Available</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Reserved</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Booked</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span className="text-xs sm:text-sm font-medium text-gray-700">Payment Submitted</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        <div className="space-y-16">
          {sections.map((section) => {
            const sectionBooths = booths.filter((b) => b.section === section);
            if (sectionBooths.length === 0) return null;
            return (
              <div key={section} className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-deepBlue font-poppins mb-6 pb-4 border-b border-gray-100">
                  {SPONSOR_SECTION_LABELS[section] || getExhibitorSectionLabel(section)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {sectionBooths.map((booth) => {
                    const isAvailable = booth.status === "AVAILABLE";
                    const isSelected = selected.has(booth.id);
                    const statusTheme = getBoothStatusTheme(booth.status);
                    return (
                      <div
                        key={booth.id}
                        onClick={() => isAvailable && toggleSelect(booth.id)}
                        className={`p-5 rounded-xl border-2 flex flex-col h-full transition-all ${isSelected
                          ? "border-maroon bg-maroon/5 shadow-lg ring-2 ring-maroon/20"
                          : isAvailable
                            ? "border-gray-200 hover:border-maroon hover:shadow-lg cursor-pointer"
                            : "border-gray-100 bg-gray-50 opacity-75"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="font-bold text-deepBlue font-poppins text-xl block">
                              {booth.name}
                            </span>
                            <span className="text-sm text-gray-500 font-inter">
                              {booth.audience === "SPONSOR"
                                ? `${getBoothSectionDisplay(section, booth.audience)}${booth.sponsorLevel ? ` (${booth.sponsorLevel})` : ""}`
                                : getBoothSectionDisplay(section, booth.audience)}
                            </span>
                          </div>
                          <span className={`w-3 h-3 rounded-full ${statusTheme.dotClass}`}></span>
                        </div>
                        <div className="mb-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${statusTheme.badgeClass}`}>
                            {isSelected ? "Selected" : statusTheme.label}
                          </span>
                          <p className="text-lg font-bold text-gray-800 font-inter">
                            KES {Number(booth.price).toLocaleString()}
                          </p>
                        </div>
                        <div className="mt-auto">
                          {isAvailable ? (
                            <span className={`w-full font-semibold py-2.5 rounded-lg block text-center text-sm ${isSelected
                              ? "bg-maroon text-white"
                              : "bg-gray-100 text-gray-600"
                              }`}>
                              {isSelected ? "✓ Selected" : "Click to select"}
                            </span>
                          ) : (
                            <button disabled className="w-full bg-gray-200 text-gray-500 font-semibold py-2.5 rounded-lg cursor-not-allowed text-sm">
                              Unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky bottom bar */}
        {selected.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 sm:py-4 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div>
                <span className="text-sm text-gray-500 font-inter">
                  {selected.size} booth{selected.size > 1 ? "s" : ""} selected
                </span>
                <p className="text-2xl font-bold text-deepBlue font-poppins">
                  KES {totalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Reservation validity: 7 days from invoice generation.
                </p>
              </div>
              <button
                onClick={handleReserve}
                disabled={submitting}
                className="bg-maroon hover:bg-gold text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
                Continue to Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
