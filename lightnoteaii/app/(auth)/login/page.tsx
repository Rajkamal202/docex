import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log In - LightNote AI",
  description: "Log in to your LightNote AI account",
}

export default function LoginPage() {
  return <LoginForm />
}
