"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileTextIcon, BuildingIcon, CreditCardIcon, DownloadIcon, Loader2Icon } from "lucide-react";

interface InvoiceItem {
  id: string;
  price: string;
  booth: { id: string; name: string; section: string };
}

interface Payment {
  id: string;
  status: string;
  method: string;
  submittedAt: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: InvoiceItem[];
  payments: Payment[];
}

export default function InvoicePreviewPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInvoices(data);
          if (data.length > 0) setActiveInvoice(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const downloadPdf = async () => {
    if (!activeInvoice) return;
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const inv = activeInvoice;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 51);
    doc.text("Agri-Business Trade Fair 2026", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("University of Eldoret", 14, 30);

    // Invoice info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice: ${inv.invoiceNumber}`, 14, 45);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 14, 52);
    doc.text(`Status: ${inv.status.replace(/_/g, " ")}`, 14, 58);

    // Table
    const rows = inv.items.map((item, i) => [
      String(i + 1),
      item.booth.name,
      item.booth.section,
      `KES ${Number(item.price).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 68,
      head: [["#", "Booth", "Section", "Price"]],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [102, 0, 0] },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    doc.setFontSize(13);
    doc.setTextColor(102, 0, 0);
    doc.text(`Total: KES ${Number(inv.totalAmount).toLocaleString()}`, 14, finalY + 14);

    // Payment instructions
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Instructions:", 14, finalY + 28);
    doc.setFontSize(9);
    doc.text("M-PESA Paybill: 123456  |  Account: " + inv.invoiceNumber, 14, finalY + 35);
    doc.text("Bank: Kenya Commercial Bank  |  Account Name: UoE Trade Fair  |  Acc No: 1122334455", 14, finalY + 41);

    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <FileTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-deepBlue font-poppins mb-2">No Invoices Yet</h1>
          <p className="text-gray-500 mb-8">Reserve booths first to generate an invoice.</p>
          <Link href="/booths" className="bg-maroon hover:bg-gold text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse Booths
          </Link>
        </div>
      </div>
    );
  }

  const inv = activeInvoice!;
  const statusColors: Record<string, string> = {
    UNPAID: "bg-red-100 text-red-800",
    PENDING_VERIFICATION: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    REJECTED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Invoice selector if multiple */}
        {invoices.length > 1 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {invoices.map((i) => (
              <button
                key={i.id}
                onClick={() => setActiveInvoice(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i.id === inv.id ? "bg-maroon text-white" : "bg-white text-deepBlue border border-gray-200 hover:border-maroon"
                  }`}
              >
                {i.invoiceNumber}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-deepBlue p-4 sm:p-6 md:p-8 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins">Invoice Preview</h1>
              <p className="text-gray-300 mt-1 font-inter">Agri-Business Trade Fair 2026</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-300 uppercase tracking-wider font-semibold">Invoice Number</p>
              <p className="text-xl sm:text-2xl font-bold text-gold font-poppins">{inv.invoiceNumber}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${statusColors[inv.status] || "bg-gray-100 text-gray-800"}`}>
                {inv.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Invoice Date</h3>
                <p className="text-gray-700 font-inter">{new Date(inv.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Reserved Booths</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                  {inv.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-bold text-deepBlue">{item.booth.name}</span>
                        <span className="text-gray-500 text-sm ml-2">({item.booth.section})</span>
                      </div>
                      <span className="font-bold text-gray-800">KES {Number(item.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-800 font-bold">Total Amount Due</span>
                    <span className="font-bold text-maroon text-xl">KES {Number(inv.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-50">
            <h3 className="text-lg font-bold text-deepBlue font-poppins mb-6 flex items-center">
              <CreditCardIcon className="w-6 h-6 mr-2 text-gold" />
              Payment Methods
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-green-600 text-lg mb-4 border-b pb-2">M-PESA Paybill</h4>
                <div className="space-y-2 font-inter text-gray-700">
                  <p className="flex justify-between"><span>Business Number:</span> <span className="font-bold">123456</span></p>
                  <p className="flex justify-between"><span>Account Number:</span> <span className="font-bold">{inv.invoiceNumber}</span></p>
                  <p className="flex justify-between"><span>Amount:</span> <span className="font-bold">KES {Number(inv.totalAmount).toLocaleString()}</span></p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-blue-600 text-lg mb-4 border-b pb-2">Bank Transfer</h4>
                <div className="space-y-2 font-inter text-gray-700">
                  <p className="flex justify-between"><span>Bank Name:</span> <span className="font-bold">Kenya Commercial Bank</span></p>
                  <p className="flex justify-between"><span>Account Name:</span> <span className="font-bold">UoE Trade Fair</span></p>
                  <p className="flex justify-between"><span>Account No:</span> <span className="font-bold">1122334455</span></p>
                  <p className="flex justify-between"><span>Branch:</span> <span className="font-bold">Eldoret Main</span></p>
                </div>
              </div>
            </div>

            {/* Payment history */}
            {inv.payments.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-deepBlue mb-3">Payment Submissions</h4>
                <div className="space-y-2">
                  {inv.payments.map((p) => (
                    <div key={p.id} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-sm">
                      <span>{p.method} - {new Date(p.submittedAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === "VERIFIED" ? "bg-green-100 text-green-800" :
                          p.status === "REJECTED" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                        }`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-end">
              <button
                onClick={downloadPdf}
                className="bg-deepBlue hover:bg-deepBlue/90 text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-lg transition-colors duration-300 flex items-center text-sm sm:text-lg shadow-md"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download PDF
              </button>
              {(inv.status === "UNPAID" || inv.status === "REJECTED") && (
                <Link
                  href={`/payment-proof?invoiceId=${inv.id}`}
                  className="bg-maroon hover:bg-gold text-white font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-lg transition-colors duration-300 flex items-center text-sm sm:text-lg shadow-md"
                >
                  <FileTextIcon className="w-5 h-5 mr-2" />
                  Upload Payment Proof
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
