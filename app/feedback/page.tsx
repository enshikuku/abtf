"use client";

import { useState } from "react";

const feedbackCategories = [
    { value: "GENERAL", label: "General Inquiry" },
    { value: "REGISTRATION", label: "Registration" },
    { value: "BOOTH_BOOKING", label: "Booth Booking" },
    { value: "PAYMENT", label: "Payment" },
    { value: "EVENT_EXPERIENCE", label: "Event Experience" },
    { value: "OTHER", label: "Other" },
];

export default function FeedbackPage() {
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
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.get("fullName"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    category: formData.get("category"),
                    subject: formData.get("subject"),
                    message: formData.get("message"),
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to submit feedback");
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
                <div className="bg-maroon py-8 px-6 text-center">
                    <h1 className="text-3xl font-bold text-white font-poppins">Public Feedback</h1>
                    <p className="text-gray-100 mt-2 font-inter">Share your questions, concerns, or suggestions about ABTF.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                    {success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            Feedback submitted successfully. Thank you for helping us improve.
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                required
                                name="category"
                                defaultValue=""
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon bg-white"
                            >
                                <option value="" disabled>
                                    Select category
                                </option>
                                {feedbackCategories.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                            <input
                                name="email"
                                type="email"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                            <input
                                name="phone"
                                type="tel"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                                placeholder="+254..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            required
                            name="subject"
                            type="text"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                            placeholder="Feedback subject"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            required
                            name="message"
                            rows={5}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-maroon focus:border-maroon"
                            placeholder="Write your message"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-deepBlue hover:bg-maroon text-white font-bold py-3 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </button>
                </form>
            </div>
        </div>
    );
}
