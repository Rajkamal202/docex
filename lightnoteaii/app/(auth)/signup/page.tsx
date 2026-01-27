import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - LightNote AI",
  description: "Create your LightNote AI account and start auditing proposals",
}

export default function SignupPage() {
  return <SignupForm />
}
