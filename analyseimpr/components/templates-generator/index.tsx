"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TemplatesHeader } from "./templates-header"
import { TemplatesSubHeader } from "./templates-sub-header"
import { TemplatesContent } from "./templates-content"
import { TemplatesFooter } from "./templates-footer"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"

export function TemplatesPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "recent" | "favorites">("all")
  const [sortBy, setSortBy] = useState("recently-modified")

  return (
      <BackgroundGradientAnimation
        containerClassName="min-h-screen"
        className="min-h-screen"
        interactive={true}
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(245, 247, 250)"
        firstColor="15, 23, 42"
        secondColor="148, 163, 184"
        thirdColor="245, 158, 11"
        pointerColor="94, 234, 212"
        blendingValue="hard-light"
        size="80%"
      >
      <div className="min-h-screen flex flex-col">
        <TemplatesHeader />
        <TemplatesSubHeader />

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-6 py-8">
            

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <TemplatesContent
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </motion.div>
          </div>
        </main>

        <TemplatesFooter />
      </div>
    </BackgroundGradientAnimation>
  )
}
