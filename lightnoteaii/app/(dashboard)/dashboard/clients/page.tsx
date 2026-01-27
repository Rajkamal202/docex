import { Suspense } from "react"
import { ClientsContent } from "@/components/dashboard/clients-content"

export default function ClientsPage() {
  return (
    <Suspense fallback={null}>
      <ClientsContent />
    </Suspense>
  )
}
