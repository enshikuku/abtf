"use client";

import { useRouter } from "next/navigation";
import { UploadIcon, CheckCircleIcon } from "lucide-react";

export default function PaymentProofPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-deepBlue py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white font-poppins">
            Submit Payment Proof
          </h1>
          <p className="text-gray-300 mt-2 font-inter">
            Invoice: INV-2026-0842
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Payment Method Used
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white text-lg"
            >
              <option value="">Select payment method</option>
              <option value="mpesa">M-PESA</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Transaction Code / Reference Number
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon text-lg uppercase"
              placeholder="e.g. QWE123RTY4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">
              Upload Payment Screenshot / Receipt
            </label>
            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer bg-gray-50">
              <div className="space-y-2 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-maroon hover:text-gold focus-within:outline-none px-2 py-1">
                    <span>Upload a file</span>
                    <input
                      id="receipt-upload"
                      name="receipt-upload"
                      type="file"
                      className="sr-only"
                      required
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start border border-blue-100">
            <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 font-inter">
              Once submitted, our team will verify your payment within 24 hours.
              You will receive a confirmation email with your exhibitor pass.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-4 px-4 rounded-lg transition-colors duration-300 font-inter text-lg shadow-md"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
