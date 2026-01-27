import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Authentication Error</h1>
        <p className="mb-6 text-gray-600">
          Something went wrong during authentication. This could happen if the link has expired or was already used.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Try logging in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create a new account
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Need help?{" "}
          <Link href="/contact" className="font-medium text-gray-900 hover:underline">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  )
}
