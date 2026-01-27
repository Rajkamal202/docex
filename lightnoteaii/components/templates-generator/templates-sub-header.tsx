"use client"

import { LayoutGrid, FileEdit } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function TemplatesSubHeader() {
  const tabs = [
    {
      label: "Templates & Generator",
      id: "templates",
      href: "/templates",
      icon: LayoutGrid,
      active: true,
      description: "Browse and create templates",
    },
    {
      label: "Improve Proposal",
      id: "improve",
      href: "/improve-proposal",
      icon: FileEdit,
      active: false,
      description: "Refine and review content",
    },
  ]

  return (
    <div className="px-6 mb-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 px-2 py-2 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Link key={tab.id} href={tab.href}>
                  <motion.div
                    className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      tab.active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                    whileHover={{ scale: tab.active ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded ${
                        tab.active 
                          ? "bg-white/20 text-white" 
                          : "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>
          
          {/* Quick tip */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 text-xs text-slate-500">
            <span>Polish your proposals with structured review tools</span>
          </div>
        </div>
      </div>
    </div>
  )
}
