"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadIcon, XIcon } from "lucide-react";
import { siteImages } from "@/lib/site-images";

export default function RegisterSponsorFormPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
        if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Allowed: PNG, JPG, SVG");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("File too large. Maximum size is 5MB");
            return;
        }

        setError("");
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const removeLogo = () => {
        setLogoFile(null);
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!logoFile) {
            setError("Please upload a company logo");
            return;
        }

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

        formData.delete("confirmPassword");
        formData.set("logo", logoFile);

        try {
            const res = await fetch("/api/sponsors", {
                method: "POST",
                body: formData,
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white font-poppins">Sponsor Registration</h1>
                    <p className="text-gray-300 mt-2 font-inter">
                        Complete this form through your company&apos;s nominated representative.
                    </p>
                </div>

                <div className="relative h-44 sm:h-52">
                    <Image
                        src={siteImages.uoe003.src}
                        alt={siteImages.uoe003.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 768px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-deepBlue/35" />
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        This account must be created by the nominated company representative who will manage registration,
                        booth bookings, invoices, payment submissions, and official ABTF communication on behalf of your organization.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Sponsor Category</label>
                        <select
                            required
                            name="sponsorLevel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select sponsor category
                            </option>
                            <option value="PLATINUM">Platinum</option>
                            <option value="GOLD">Gold</option>
                            <option value="SILVER">Silver</option>
                            <option value="BRONZE">Bronze</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Your selected category determines which sponsor-designated booths will be available for booking.
                        </p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Website</label>
                            <input
                                required
                                name="website"
                                type="url"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Company Description</label>
                        <textarea
                            required
                            name="description"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
                            placeholder="Describe your company and sponsorship objectives..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Logo Upload (Required)</label>

                        {logoPreview ? (
                            <div className="relative mt-1 border-2 border-maroon rounded-lg p-4 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={logoPreview}
                                        alt="Logo preview"
                                        width={120}
                                        height={80}
                                        className="h-20 w-auto object-contain rounded"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{logoFile?.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {logoFile ? (logoFile.size / 1024).toFixed(1) + " KB" : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer bg-gray-50"
                            >
                                <div className="space-y-1 text-center">
                                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <span className="font-medium text-maroon hover:text-gold">Upload a file</span>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                            onChange={handleFileChange}
                            className="sr-only"
                        />
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
