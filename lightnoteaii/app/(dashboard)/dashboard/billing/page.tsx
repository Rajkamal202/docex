"use client"

import { useState } from "react"
import { useCredit, FEATURE_COSTS, type FeatureType } from "@/lib/credit-store"

const featureLabels: Record<FeatureType, string> = {
  proposal_audit: "Proposal Audit",
  ai_rewrite: "AI Rewrite",
  generate_proposal: "Generate Proposal",
  export_pdf: "Export PDF",
  detailed_analysis: "Detailed Analysis",
}

export default function BillingPage() {
  const {
    balance,
    initialCredit,
    transactions = [],
    isLowBalance,
    isCreditExhausted,
    hasAddedPayment,
    addPaymentMethod,
    isLoading,
  } = useCredit()

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const usedCredit = initialCredit - balance
  const usagePercentage = (usedCredit / initialCredit) * 100

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your credits and subscription</p>
      </div>

      {/* Low Balance Warning */}
      {isLowBalance && !isCreditExhausted && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <svg
                className="h-5 w-5 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800">Low Credit Balance</h3>
              <p className="text-sm text-amber-700 mt-0.5">
                You have ${balance.toFixed(2)} remaining. Add a payment method to continue using paid features without
                interruption.
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Exhausted Warning */}
      {isCreditExhausted && !hasAddedPayment && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Credit Exhausted</h3>
              <p className="text-sm text-red-700 mt-0.5">
                Your promotional credit has been fully used. Upgrade to a paid plan to continue accessing premium
                features.
              </p>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Balance Card */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Credit</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-semibold text-gray-900">${balance.toFixed(2)}</span>
                <span className="text-sm text-gray-400">/ ${initialCredit.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
          </div>

          {/* Usage Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Credit Used</span>
              <span>${usedCredit.toFixed(2)} used</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usagePercentage > 75 ? "bg-red-500" : usagePercentage > 50 ? "bg-amber-500" : "bg-gray-900"
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Credit Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Initial Credit</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">${initialCredit.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Total Used</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">${usedCredit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Promotional Credit Notice */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <p className="text-xs text-gray-500">
              Promotional credit is non-withdrawable and non-transferable. Valid until fully consumed.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Pricing */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Feature Pricing</h2>
          <p className="text-sm text-gray-500 mt-0.5">Cost per feature usage</p>
        </div>
        <div className="divide-y divide-gray-100">
          {(Object.keys(FEATURE_COSTS) as FeatureType[]).map((key) => {
            const cost = FEATURE_COSTS[key]
            return (
              <div key={key} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    {key === "proposal_audit" && (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                        />
                      </svg>
                    )}
                    {key === "ai_rewrite" && (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                        />
                      </svg>
                    )}
                    {key === "generate_proposal" && (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10.5"
                        />
                      </svg>
                    )}
                    {key === "export_pdf" && (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    )}
                    {key === "detailed_analysis" && (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{featureLabels[key]}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">${cost.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Usage History */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Usage History</h2>
          <p className="text-sm text-gray-500 mt-0.5">Your credit transaction history</p>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mt-3 text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      txn.type === "credit" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(txn.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === "credit" ? "text-green-600" : "text-gray-900"}`}>
                    {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">Bal: ${txn.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upgrade Your Plan</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* Starter Plan */}
              <button
                onClick={() => setSelectedPlan("starter")}
                className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                  selectedPlan === "starter" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">Starter</p>
                    <p className="text-sm text-gray-500 mt-0.5">Perfect for freelancers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">$19</p>
                    <p className="text-xs text-gray-400">/month</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    10 proposal audits/month
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    5 AI rewrites/month
                  </li>
                </ul>
              </button>

              {/* Pro Plan */}
              <button
                onClick={() => setSelectedPlan("pro")}
                className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                  selectedPlan === "pro" ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-gray-900">Pro</p>
                      <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium text-white uppercase">
                        Popular
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">For growing agencies</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">$49</p>
                    <p className="text-xs text-gray-400">/month</p>
                  </div>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited proposal audits
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited AI rewrites
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addPaymentMethod()
                  setShowUpgradeModal(false)
                }}
                disabled={!selectedPlan}
                className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
