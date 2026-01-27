"use client"

import { useState } from "react"
import { useCredits } from "@/lib/credit-store"

interface AddCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CREDIT_PACKAGES = [
  { id: "starter", amount: 20, price: 499, popular: false, label: "Starter" },
  { id: "standard", amount: 50, price: 999, popular: true, label: "Standard" },
  { id: "pro", amount: 100, price: 1799, popular: false, label: "Pro" },
  { id: "enterprise", amount: 250, price: 3999, popular: false, label: "Enterprise" },
]

type PaymentMethod = "upi" | "card" | "netbanking"

export function AddCreditsModal({ isOpen, onClose, onSuccess }: AddCreditsModalProps) {
  const { addCredits } = useCredits()
  const [selectedPackage, setSelectedPackage] = useState<string>("standard")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const selectedPkg = CREDIT_PACKAGES.find((p) => p.id === selectedPackage)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handlePayment = async () => {
    if (!selectedPkg) return

    setIsProcessing(true)
    setError(null)

    try {
      // Validate payment details
      if (paymentMethod === "upi") {
        if (!upiId || !upiId.includes("@")) {
          throw new Error("Please enter a valid UPI ID (e.g., yourname@upi)")
        }
      } else if (paymentMethod === "card") {
        if (cardNumber.replace(/\s/g, "").length < 16) {
          throw new Error("Please enter a valid 16-digit card number")
        }
        if (cardExpiry.length < 5) {
          throw new Error("Please enter a valid expiry date (MM/YY)")
        }
        if (cardCvv.length < 3) {
          throw new Error("Please enter a valid CVV")
        }
        if (!cardName.trim()) {
          throw new Error("Please enter the cardholder name")
        }
      }

      // Simulate payment processing (in production, integrate with Razorpay/Stripe)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = await addCredits(
        selectedPkg.amount,
        `Purchased ${selectedPkg.label} package - ₹${selectedPkg.price}`,
      )

      if (!result) {
        throw new Error("Failed to add credits. Please try again.")
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
        setSuccess(false)
        // Reset form
        setSelectedPackage("standard")
        setPaymentMethod("upi")
        setUpiId("")
        setCardNumber("")
        setCardExpiry("")
        setCardCvv("")
        setCardName("")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Add Credits</h2>
              <p className="text-sm text-gray-300 mt-0.5">Choose a package and payment method</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">Payment Successful!</h3>
            <p className="mt-2 text-gray-600">
              ${selectedPkg?.amount.toFixed(2)} credits have been added to your account.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Credit Packages */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Credit Package</h3>
              <div className="grid grid-cols-2 gap-3">
                {CREDIT_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      selectedPackage === pkg.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                        POPULAR
                      </span>
                    )}
                    <p className="text-base font-semibold text-gray-900">{pkg.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${pkg.amount}</p>
                    <p className="text-xs text-gray-500 mt-0.5">₹{pkg.price} INR</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === "upi"
                      ? "border-gray-900 bg-gray-50 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.5 13.5H12v-3h-1.5v3zm6 0H18v-3h-1.5v3zm-3.75-9L6 11.25V21h12V11.25L12.75 4.5zm0 2.25l4.5 5.25v7.5h-9v-7.5l4.5-5.25z" />
                  </svg>
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === "card"
                      ? "border-gray-900 bg-gray-50 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  Card
                </button>
                <button
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    paymentMethod === "netbanking"
                      ? "border-gray-900 bg-gray-50 text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                  Net Banking
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              {paymentMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Enter your UPI ID (Google Pay, PhonePe, Paytm, etc.)</p>
                </div>
              )}

              {paymentMethod === "card" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </>
              )}

              {paymentMethod === "netbanking" && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    You will be redirected to your bank's website to complete the payment.
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Summary and Pay Button */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">₹{selectedPkg?.price || 0}</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full rounded-xl bg-gray-900 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Pay ₹{selectedPkg?.price || 0}
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Secured by 256-bit SSL encryption. Your payment information is safe.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
