import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Check your email</h1>
        <p className="mb-6 text-gray-600">
          We&apos;ve sent you a confirmation link. Please check your email to verify your account and get started.
        </p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-left">
          <h3 className="mb-2 font-medium text-gray-900">What&apos;s next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                1
              </span>
              Open the email from LightNote AI
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                2
              </span>
              Click the confirmation link
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                3
              </span>
              Start using your $20 welcome credit
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Didn&apos;t receive an email?{" "}
          <Link href="/signup" className="font-medium text-gray-900 hover:underline">
            Try again
          </Link>
        </p>
      </div>
    </div>
  )
}
