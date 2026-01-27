"use client"

import { Bell, FileText, Home, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function TemplatesHeader() {
  return (
    <header className="sticky top-0 z-50 py-4 px-6">
      <div className="max-w-6xl mx-auto">
        <nav className="bg-white/90 backdrop-blur-xl border border-slate-200/60 px-4 py-2.5 flex items-center justify-between rounded-2xl shadow-sm">
          {/* Left - Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-sm">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-slate-900">LightNoteAI</span>
              <span className="text-xs text-slate-500 block">Templates Studio</span>
            </div>
          </Link>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-slate-100/80 rounded-xl">
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="h-4 w-4" />
                Home
              </motion.div>
            </Link>
            <Link href="/templates">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-900 shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Templates
              </motion.div>
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help & Support</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-px h-6 bg-slate-200 mx-1" />
            
            <Avatar className="h-9 w-9 ring-2 ring-slate-100 cursor-pointer hover:ring-slate-200 transition-all">
              <AvatarImage src="/professional-man-avatar.png" />
              <AvatarFallback className="bg-slate-900 text-white text-xs font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </nav>
      </div>
    </header>
  )
}
