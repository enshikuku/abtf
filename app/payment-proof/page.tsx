"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadIcon, CheckCircleIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: string;
  status: string;
}

function PaymentProofForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("invoiceId");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [invoiceId, setInvoiceId] = useState(preselectedId || "");
  const [method, setMethod] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const payable = data.filter((i: Invoice) => i.status === "UNPAID" || i.status === "REJECTED");
          setInvoices(payable);
          if (preselectedId && payable.some((i: Invoice) => i.id === preselectedId)) {
            setInvoiceId(preselectedId);
          } else if (payable.length === 1) {
            setInvoiceId(payable[0].id);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [preselectedId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileName(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId || !method || !file) return;

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("invoiceId", invoiceId);
    formData.append("method", method);
    formData.append("transactionCode", transactionCode);
    formData.append("notes", notes);
    formData.append("proofImage", file);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit payment");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-deepBlue font-poppins mb-2">Payment Submitted!</h1>
          <p className="text-gray-600 mb-8">
            Your payment proof has been submitted for verification. You will be notified once it is reviewed.
          </p>
          <button
            onClick={() => router.push("/invoice-preview")}
            className="bg-maroon hover:bg-gold text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Invoices
          </button>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-lg mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
          <AlertCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-deepBlue font-poppins mb-2">No Pending Invoices</h1>
          <p className="text-gray-600 mb-8">All your invoices have been paid or are pending verification.</p>
          <button
            onClick={() => router.push("/invoice-preview")}
            className="bg-maroon hover:bg-gold text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Invoices
          </button>
        </div>
      </div>
    );
  }

  const selectedInvoice = invoices.find((i) => i.id === invoiceId);

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-deepBlue py-8 px-8 text-center">
          <h1 className="text-3xl font-bold text-white font-poppins">Submit Payment Proof</h1>
          {selectedInvoice && (
            <p className="text-gray-300 mt-2 font-inter">
              Invoice: {selectedInvoice.invoiceNumber} &mdash; KES {Number(selectedInvoice.totalAmount).toLocaleString()}
            </p>
          )}
        </div>

        {error && (
          <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Invoice selector */}
          {invoices.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Invoice</label>
              <select
                required
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white text-lg"
              >
                <option value="">Select invoice</option>
                {invoices.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.invoiceNumber} - KES {Number(i.totalAmount).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Payment Method Used</label>
            <select
              required
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white text-lg"
            >
              <option value="">Select payment method</option>
              <option value="MPESA">M-PESA</option>
              <option value="BANK">Bank Transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Transaction Code / Reference Number</label>
            <input
              required
              type="text"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon text-lg uppercase"
              placeholder="e.g. QWE123RTY4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Upload Payment Screenshot / Receipt</label>
            <div
              className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-maroon transition-colors cursor-pointer bg-gray-50"
              onClick={() => document.getElementById("receipt-upload")?.click()}
            >
              <div className="space-y-2 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  {fileName ? (
                    <span className="font-medium text-maroon">{fileName}</span>
                  ) : (
                    <span>Click to upload a file</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            <input
              id="receipt-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-inter mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon"
              placeholder="Any additional information..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-start border border-blue-100">
            <CheckCircleIcon className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 font-inter">
              Once submitted, our team will verify your payment within 24 hours.
              You will receive confirmation once your booths are confirmed.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !invoiceId || !method || !file}
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-4 px-4 rounded-lg transition-colors duration-300 font-inter text-lg shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2Icon className="h-5 w-5 animate-spin" />}
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PaymentProofPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2Icon className="h-8 w-8 animate-spin text-maroon" /></div>}>
      <PaymentProofForm />
    </Suspense>
  );
}
