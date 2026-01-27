import { Suspense } from "react"
import HistoryContent from "./history-content"

export default function HistoryPage() {
  return (
    <Suspense fallback={<HistoryLoading />}>
      <HistoryContent />
    </Suspense>
  )
}

function HistoryLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  )
}
