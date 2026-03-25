"use client";

import { useState } from "react";

const attendeeTypes = [
    { value: "FARMER", label: "Farmer" },
    { value: "STUDENT", label: "Student" },
    { value: "RESEARCHER", label: "Researcher" },
    { value: "INVESTOR", label: "Investor" },
    { value: "GOVERNMENT", label: "Government/Agency" },
    { value: "OTHER", label: "Other" },
];

export default function AttendeeRegistrationPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch("/api/attendees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.get("fullName"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    organization: formData.get("organization"),
                    county: formData.get("county"),
                    attendeeType: formData.get("attendeeType"),
                    interests: formData.get("interests"),
                    notes: formData.get("notes"),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to submit registration");
                return;
            }

            setSuccess(true);
            form.reset();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-deepBlue py-8 px-6 text-center">
                    <h1 className="text-3xl font-bold text-white font-poppins">Attendee Registration</h1>
                    <p className="text-gray-200 mt-2 font-inter">Join ABTF as an attendee and receive event updates.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            Registration submitted successfully. Our team will contact you with event details.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                required
                                name="fullName"
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                required
                                name="email"
                                type="email"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                required
                                name="phone"
                                type="tel"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="+254..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Attendee Type</label>
                            <select
                                required
                                name="attendeeType"
                                defaultValue=""
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon bg-white"
                            >
                                <option value="" disabled>
                                    Select attendee type
                                </option>
                                {attendeeTypes.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
                            <input
                                name="organization"
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="Company/Institution"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">County (Optional)</label>
                            <input
                                name="county"
                                type="text"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="Your county"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Interest (Optional)</label>
                        <textarea
                            name="interests"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                            placeholder="What topics or exhibition areas are you interested in?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                            placeholder="Any accessibility needs or extra context"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-maroon hover:bg-gold text-white font-bold py-3 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Registration"}
                    </button>
                </form>
            </div>
        </div>
    );
}
