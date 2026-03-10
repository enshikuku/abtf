import React from 'react';
import { useRouter } from '../components/RouterContext';
import { FileTextIcon, BuildingIcon, CreditCardIcon } from 'lucide-react';
export function InvoicePreviewPage() {
  const { navigateTo } = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-deepBlue p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold font-poppins">
                Invoice Preview
              </h1>
              <p className="text-gray-300 mt-1 font-inter">
                Agri-Business Trade Fair 2026
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300 uppercase tracking-wider font-semibold">
                Invoice Number
              </p>
              <p className="text-2xl font-bold text-gold font-poppins">
                INV-2026-0842
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Billed To
                </h3>
                <div className="flex items-start">
                  <BuildingIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-bold text-deepBlue text-lg">
                      Acme Agri-Tech Ltd
                    </p>
                    <p className="text-gray-600">John Doe</p>
                    <p className="text-gray-600">john@acmeagri.com</p>
                    <p className="text-gray-600">+254 712 345 678</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Reservation Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Booth Number:</span>
                    <span className="font-bold text-deepBlue">M-04</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Booth Section:</span>
                    <span className="font-bold text-deepBlue">
                      Machinery Booths
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-800 font-bold">Amount Due:</span>
                    <span className="font-bold text-maroon text-xl">
                      KES 100,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-8 bg-gray-50">
            <h3 className="text-lg font-bold text-deepBlue font-poppins mb-6 flex items-center">
              <CreditCardIcon className="w-6 h-6 mr-2 text-gold" />
              Payment Methods
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-green-600 text-lg mb-4 border-b pb-2">
                  M-PESA Paybill
                </h4>
                <div className="space-y-2 font-inter text-gray-700">
                  <p className="flex justify-between">
                    <span>Business Number:</span>{' '}
                    <span className="font-bold">123456</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Account Number:</span>{' '}
                    <span className="font-bold">INV-2026-0842</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Amount:</span>{' '}
                    <span className="font-bold">KES 100,000</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-blue-600 text-lg mb-4 border-b pb-2">
                  Bank Transfer
                </h4>
                <div className="space-y-2 font-inter text-gray-700">
                  <p className="flex justify-between">
                    <span>Bank Name:</span>{' '}
                    <span className="font-bold">Kenya Commercial Bank</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Account Name:</span>{' '}
                    <span className="font-bold">UoE Trade Fair</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Account No:</span>{' '}
                    <span className="font-bold">1122334455</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Branch:</span>{' '}
                    <span className="font-bold">Eldoret Main</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigateTo('payment-proof')}
                className="bg-maroon hover:bg-gold text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 flex items-center text-lg shadow-md">

                <FileTextIcon className="w-5 h-5 mr-2" />
                Upload Payment Proof
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}