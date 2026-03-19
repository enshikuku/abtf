"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterExhibitorFormPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/exhibitors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: formData.get("companyName"),
                    contactPerson: formData.get("contactPerson"),
                    phone: formData.get("phone"),
                    email: formData.get("email"),
                    password,
                    category: formData.get("category"),
                    description: formData.get("description"),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            router.push("/booths");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-deepBlue py-6 sm:py-8 px-4 sm:px-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white font-poppins">Exhibitor Registration</h1>
                    <p className="text-gray-300 mt-2 font-inter">
                        Complete your registration through your company&apos;s nominated representative.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        The account created here belongs to the organization&apos;s nominated representative and official contact.
                        This person will manage the company profile, booth reservations, invoices, and communication with ABTF organizers.
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Company Name</label>
                            <input
                                required
                                name="companyName"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                                placeholder="Enter company name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Contact Person</label>
                            <input
                                required
                                name="contactPerson"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Phone Number</label>
                            <input
                                required
                                name="phone"
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                                placeholder="+254..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Email Address</label>
                            <input
                                required
                                name="email"
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700" id="password-help">
                        This password will be used by the nominated company representative to securely access and manage
                        your ABTF registration, bookings, and account information.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Create Password</label>
                        <input
                            required
                            aria-describedby="password-help"
                            name="password"
                            type="password"
                            minLength={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                            placeholder="Min. 8 characters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Confirm Password</label>
                        <input
                            required
                            name="confirmPassword"
                            type="password"
                            minLength={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                            placeholder="Re-enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Exhibition Category</label>
                        <select
                            required
                            name="category"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            <option value="machinery">Machinery</option>
                            <option value="crops">Crops</option>
                            <option value="animals">Animals</option>
                            <option value="food">Food</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Business Description</label>
                        <textarea
                            required
                            name="description"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                            placeholder="Briefly describe your products/services..."
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-maroon hover:bg-gold text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 font-inter text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registering..." : "Continue to Booth Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
