"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface SubHeaderProps {
  activeTab?: "improve" | "templates"
}

export function SubHeader({ activeTab = "improve" }: SubHeaderProps) {
  const tabs = [
    { 
      label: "Templates", 
      id: "templates", 
      href: "/templates"
    },
    { 
      label: "Improve", 
      id: "improve", 
      href: "/improve-proposal"
    },
  ]

  return (
    <div className="px-6 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between border-b border-slate-200 pb-6">
          {/* Title */}
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Proposal Studio</p>
            <h1 className="text-xl font-semibold text-slate-900">Improve Your Proposal</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <Link key={tab.id} href={tab.href}>
                  <div
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
