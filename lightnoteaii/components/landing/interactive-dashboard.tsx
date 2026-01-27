"use client"

import type React from "react"

import { useState } from "react"
import {
  Eye,
  BarChart3,
  Smile,
  Search,
  Calendar,
  Tag,
  Users,
  FileText,
  Settings,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

type PageType = "overview" | "proposals" | "templates" | "clients" | "settings"
type ChartMetric = "views" | "engagement" | "conversions"
type TimeRange = "7days" | "30days" | "90days"

const chartData = {
  "7days": {
    views: [65, 68, 72, 75, 78, 80, 82],
    engagement: [55, 58, 62, 65, 68, 70, 72],
    conversions: [45, 48, 52, 55, 58, 60, 62],
  },
  "30days": {
    views: [50, 55, 58, 62, 65, 68, 72, 75, 78, 80, 82, 85],
    engagement: [40, 45, 48, 52, 55, 58, 62, 65, 68, 70, 72, 75],
    conversions: [30, 35, 38, 42, 45, 48, 52, 55, 58, 60, 62, 65],
  },
  "90days": {
    views: [40, 45, 50, 55, 60, 65, 70, 75, 78, 80, 82, 85, 87, 90],
    engagement: [30, 35, 40, 45, 50, 55, 60, 65, 68, 70, 72, 75, 77, 80],
    conversions: [20, 25, 30, 35, 40, 45, 50, 55, 58, 60, 62, 65, 67, 70],
  },
}

const proposalData = {
  overview: [
    { id: 1, client: "Acme Corp", color: "bg-orange-500", views: "High", score: 86, value: "$12k", trend: "up" },
    { id: 2, client: "TechStart", color: "bg-green-500", views: "Medium", score: 62, value: "$8k", trend: "down" },
    { id: 3, client: "StartupX", color: "bg-blue-500", views: "High", score: 89, value: "$15k", trend: "down" },
    { id: 4, client: "DesignCo", color: "bg-pink-500", views: "Medium", score: 76, value: "$6k", trend: "down" },
    { id: 5, client: "AgencyY", color: "bg-purple-500", views: "Low", score: 88, value: "$9k", trend: "up" },
  ],
  proposals: [
    { id: 1, client: "Acme Corp", color: "bg-orange-500", views: "High", score: 92, value: "$18k", trend: "up" },
    { id: 2, client: "TechStart", color: "bg-green-500", views: "High", score: 85, value: "$12k", trend: "up" },
    { id: 3, client: "NewClient", color: "bg-yellow-500", views: "Medium", score: 78, value: "$7k", trend: "up" },
  ],
  templates: [
    { id: 1, client: "Web Design", color: "bg-blue-500", views: "94%", score: 94, value: "12 wins", trend: "up" },
    { id: 2, client: "Development", color: "bg-purple-500", views: "88%", score: 88, value: "8 wins", trend: "up" },
    { id: 3, client: "Consulting", color: "bg-green-500", views: "82%", score: 82, value: "6 wins", trend: "down" },
  ],
  clients: [
    { id: 1, client: "Enterprise", color: "bg-orange-500", views: "82%", score: 90, value: "$45k", trend: "up" },
    { id: 2, client: "SMB", color: "bg-blue-500", views: "71%", score: 85, value: "$28k", trend: "up" },
    { id: 3, client: "Startup", color: "bg-green-500", views: "58%", score: 78, value: "$12k", trend: "down" },
  ],
  settings: [
    { id: 1, client: "Win Alerts", color: "bg-gray-500", views: "On", score: 100, value: "Active", trend: "up" },
    { id: 2, client: "Auto-scoring", color: "bg-gray-500", views: "On", score: 100, value: "Active", trend: "up" },
    { id: 3, client: "Insights", color: "bg-gray-500", views: "On", score: 100, value: "Active", trend: "up" },
  ],
}

const pageStats = {
  overview: { winRate: "68%", proposals: "24", avgValue: "$8.5k", trend: "improving steadily" },
  proposals: { winRate: "72%", proposals: "18", avgValue: "$10.2k", trend: "above benchmark" },
  templates: { winRate: "85%", proposals: "26", avgValue: "$9.1k", trend: "top performer" },
  clients: { winRate: "61%", proposals: "32", avgValue: "$7.8k", trend: "opportunity identified" },
  settings: { winRate: "N/A", proposals: "N/A", avgValue: "N/A", trend: "All systems operational" },
}

export function InteractiveDashboard() {
  const [activePage, setActivePage] = useState<PageType>("overview")
  const [activeMetrics, setActiveMetrics] = useState<ChartMetric[]>(["views", "engagement", "conversions"])
  const [timeRange, setTimeRange] = useState<TimeRange>("7days")
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const toggleMetric = (metric: ChartMetric) => {
    if (activeMetrics.includes(metric)) {
      if (activeMetrics.length > 1) {
        setActiveMetrics(activeMetrics.filter((m) => m !== metric))
      }
    } else {
      setActiveMetrics([...activeMetrics, metric])
    }
  }

  const getPageTitle = () => {
    switch (activePage) {
      case "overview":
        return "Decision Dashboard — Win confidence " + pageStats[activePage].trend
      case "proposals":
        return "Proposal Outcomes — Performance " + pageStats[activePage].trend
      case "templates":
        return "Winning Patterns — This template is a " + pageStats[activePage].trend
      case "clients":
        return "Client Success — " + pageStats[activePage].trend
      case "settings":
        return "Configuration — " + pageStats[activePage].trend
    }
  }

  const generatePath = (data: number[], height = 120) => {
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 400
      const y = height - (value / 100) * height
      return `${x},${y}`
    })
    return `M${points.join(" L")}`
  }

  const handleChartHover = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setTooltipPosition({ x, y })
    setShowTooltip(true)
  }

  const stats = pageStats[activePage]
  const proposals = proposalData[activePage]
  const currentChartData = chartData[timeRange]

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] overflow-hidden">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f0f0f] text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[#0f0f0f]">Win Intelligence Dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[#0f0f0f] font-medium flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-[#0f0f0f] flex items-center justify-center text-white text-[8px]">L</div>
            Decision Confidence
          </span>
          <button
            onClick={() => setTimeRange(timeRange === "7days" ? "30days" : timeRange === "30days" ? "90days" : "7days")}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[#6b7280] flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Calendar className="h-3 w-3" />
            {timeRange === "7days" ? "Last 7 days" : timeRange === "30days" ? "Last 30 days" : "Last 90 days"}
          </button>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[#6b7280] flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer">
            <Tag className="h-3 w-3" />
            All outcomes
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[#6b7280] flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer">
            <Users className="h-3 w-3" />
            All Clients
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Interactive */}
        <div className="w-48 border-r border-gray-100 p-4">
          <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-3">
            <Search className="h-4 w-4" />
            Quick Actions
          </div>
          <div className="text-xs text-[#6b7280] mb-2">Insights</div>
          <div className="space-y-1">
            <button
              onClick={() => setActivePage("overview")}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                activePage === "overview" ? "bg-gray-100 text-[#0f0f0f]" : "text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Win Overview
            </button>
            <button
              onClick={() => setActivePage("proposals")}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                activePage === "proposals"
                  ? "bg-gray-100 text-[#0f0f0f] font-medium"
                  : "text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              Outcomes
            </button>
            <button
              onClick={() => setActivePage("templates")}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                activePage === "templates"
                  ? "bg-gray-100 text-[#0f0f0f] font-medium"
                  : "text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Winning Patterns
            </button>
            <button
              onClick={() => setActivePage("clients")}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                activePage === "clients" ? "bg-gray-100 text-[#0f0f0f] font-medium" : "text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Client Success
            </button>
            <button
              onClick={() => setActivePage("settings")}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                activePage === "settings" ? "bg-gray-100 text-[#0f0f0f] font-medium" : "text-[#6b7280] hover:bg-gray-50"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-5">
          <div className="flex items-center gap-2 text-xs text-[#6b7280] mb-3">
            <span className="h-4 w-4 rounded-full border border-gray-200 flex items-center justify-center">
              <Eye className="h-2.5 w-2.5" />
            </span>
            {getPageTitle()}
          </div>
          <div className="flex gap-4 text-xs mb-4">
            <span>
              Win Rate: <strong className="text-[#0f0f0f]">{stats.winRate}</strong>{" "}
              {stats.winRate !== "N/A" && <span className="text-green-500">↗</span>}
            </span>
            <span>
              · Proposals Closed: <strong className="text-[#0f0f0f]">{stats.proposals}</strong>{" "}
              {stats.proposals !== "N/A" && <span className="text-green-500">↗</span>}
            </span>
            <span>
              · Avg. Deal Size: <strong className="text-[#0f0f0f]">{stats.avgValue}</strong>{" "}
              {stats.avgValue !== "N/A" && <span className="text-green-500">↗</span>}
            </span>
          </div>

          {/* Chart Area */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 text-xs text-[#6b7280] mb-3">
                <button
                  onClick={() => toggleMetric("views")}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    activeMetrics.includes("views") ? "bg-orange-100 text-orange-600" : "hover:bg-gray-100"
                  }`}
                >
                  <Eye className="h-3 w-3" /> Quality Score
                </button>
                <button
                  onClick={() => toggleMetric("engagement")}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    activeMetrics.includes("engagement") ? "bg-green-100 text-green-600" : "hover:bg-gray-100"
                  }`}
                >
                  <Smile className="h-3 w-3" /> Win Rate
                </button>
                <button
                  onClick={() => toggleMetric("conversions")}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                    activeMetrics.includes("conversions") ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-3 w-3" /> Revenue
                </button>
              </div>
              <div className="h-40 relative">
                <svg
                  className="w-full h-full cursor-crosshair"
                  viewBox="0 0 400 120"
                  preserveAspectRatio="none"
                  onMouseMove={handleChartHover}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                  {activeMetrics.includes("views") && (
                    <path
                      d={generatePath(currentChartData.views)}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      className="transition-opacity duration-300"
                    />
                  )}
                  {activeMetrics.includes("engagement") && (
                    <path
                      d={generatePath(currentChartData.engagement)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      className="transition-opacity duration-300"
                    />
                  )}
                  {activeMetrics.includes("conversions") && (
                    <path
                      d={generatePath(currentChartData.conversions)}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      className="transition-opacity duration-300"
                    />
                  )}
                </svg>
                {showTooltip && (
                  <div
                    className="absolute bg-[#1a1a2e] text-white rounded-lg px-3 py-2 text-xs pointer-events-none transition-all duration-150 z-10"
                    style={{ left: Math.min(tooltipPosition.x, 280), top: Math.max(tooltipPosition.y - 80, 0) }}
                  >
                    <div className="font-medium mb-1">
                      {timeRange === "7days" ? "This Week" : timeRange === "30days" ? "This Month" : "This Quarter"}
                    </div>
                    {activeMetrics.includes("views") && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span> Quality Score{" "}
                        <span className="text-green-400">
                          {currentChartData.views[currentChartData.views.length - 1]}/100
                        </span>
                      </div>
                    )}
                    {activeMetrics.includes("engagement") && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span> Win Rate{" "}
                        <span className="text-green-400">
                          {currentChartData.engagement[currentChartData.engagement.length - 1]}%
                        </span>
                      </div>
                    )}
                    {activeMetrics.includes("conversions") && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span> Revenue{" "}
                        <span className="text-green-400">
                          ${currentChartData.conversions[currentChartData.conversions.length - 1]}k
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1">
                {timeRange === "7days" && (
                  <>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </>
                )}
                {timeRange === "30days" && (
                  <>
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </>
                )}
                {timeRange === "90days" && (
                  <>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Dynamic Table */}
            <div className="w-64 border-l border-gray-100 pl-4">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-medium">
                  {activePage === "overview" && "Highest win confidence"}
                  {activePage === "proposals" && "Recent outcomes"}
                  {activePage === "templates" && "Best performing patterns"}
                  {activePage === "clients" && "Client win history"}
                  {activePage === "settings" && "System status"}
                </span>
                <span className="text-[#6b7280] flex items-center gap-1 hover:text-[#0f0f0f] cursor-pointer transition-colors">
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
              <div className="text-[10px] text-[#9ca3af] mb-2">
                {activePage === "settings" ? "Configuration status" : "What this reveals about effectiveness"}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[#9ca3af]">
                    <th className="text-left font-normal pb-2">#</th>
                    <th className="text-left font-normal pb-2">{activePage === "settings" ? "Setting" : "Proposal"}</th>
                    <th className="text-right font-normal pb-2">
                      {activePage === "settings" ? "Status" : "Confidence"}
                    </th>
                    <th className="text-right font-normal pb-2">Score</th>
                    <th className="text-right font-normal pb-2">{activePage === "templates" ? "Wins" : "Value"}</th>
                  </tr>
                </thead>
                <tbody className="text-[#0f0f0f]">
                  {proposals.map((proposal) => (
                    <tr
                      key={proposal.id}
                      className={`cursor-pointer transition-colors ${hoveredRow === proposal.id ? "bg-gray-50" : ""}`}
                      onMouseEnter={() => setHoveredRow(proposal.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="py-1.5">{proposal.id}</td>
                      <td className="py-1.5 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${proposal.color}`}></span>
                        {proposal.client}
                      </td>
                      <td className="py-1.5 text-right">{proposal.views}</td>
                      <td className="py-1.5 text-right">{proposal.score}</td>
                      <td className="py-1.5 text-right flex items-center justify-end gap-1">
                        {proposal.value}
                        {proposal.trend === "up" ? (
                          <span className="text-green-500 text-[10px]">↗</span>
                        ) : (
                          <span className="text-red-500 text-[10px]">↘</span>
                        )}
                        {hoveredRow === proposal.id && <ChevronRight className="h-3 w-3 text-[#9ca3af]" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
