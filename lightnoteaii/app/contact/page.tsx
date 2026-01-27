"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MessageSquare, Building2, Users, Clock, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                {/* Left Column - Info */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 mb-6">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Talk to Sales
                  </div>
                  <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl tracking-tight">
                    Let's discuss how LightNote AI can help your team win more proposals.
                  </h1>
                  <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                    Whether you're exploring enterprise options, need a custom integration, or want to understand how
                    proposal intelligence can transform your win-rate — we're here to help.
                  </p>

                  {/* Benefits */}
                  <div className="mt-12 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Building2 className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Enterprise-Ready</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Custom contracts, SSO, dedicated support, and SLA guarantees for your organization.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Users className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Team Onboarding</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Personalized training sessions to get your team up and running with decision confidence.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Clock className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Quick Response</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Our sales team typically responds within 24 hours on business days.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">Prefer email?</p>
                    <a
                      href="mailto:sales@lightnote.ai"
                      className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-gray-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      sales@lightnote.ai
                    </a>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="lg:pl-8">
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank you!</h3>
                        <p className="text-gray-500 max-w-sm">
                          We've received your message and will get back to you within 24 hours.
                        </p>
                        <Button
                          className="mt-8 bg-gray-900 text-white hover:bg-gray-800"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send another message
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in touch</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="firstName" className="text-sm text-gray-700">
                                First name
                              </Label>
                              <Input
                                id="firstName"
                                placeholder="John"
                                required
                                className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName" className="text-sm text-gray-700">
                                Last name
                              </Label>
                              <Input
                                id="lastName"
                                placeholder="Doe"
                                required
                                className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-gray-700">
                              Work email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@company.com"
                              required
                              className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-sm text-gray-700">
                              Company name
                            </Label>
                            <Input
                              id="company"
                              placeholder="Acme Inc."
                              required
                              className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="teamSize" className="text-sm text-gray-700">
                              Team size
                            </Label>
                            <Select required>
                              <SelectTrigger className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400">
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-5">1-5 people</SelectItem>
                                <SelectItem value="6-20">6-20 people</SelectItem>
                                <SelectItem value="21-50">21-50 people</SelectItem>
                                <SelectItem value="51-200">51-200 people</SelectItem>
                                <SelectItem value="200+">200+ people</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="interest" className="text-sm text-gray-700">
                              What are you interested in?
                            </Label>
                            <Select required>
                              <SelectTrigger className="h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enterprise">Enterprise plan</SelectItem>
                                <SelectItem value="team">Team plan</SelectItem>
                                <SelectItem value="custom">Custom integration</SelectItem>
                                <SelectItem value="demo">Product demo</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message" className="text-sm text-gray-700">
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Tell us about your team's proposal workflow and what you're looking to achieve..."
                              rows={4}
                              className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 resize-none"
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full h-11 bg-gray-900 text-white hover:bg-gray-800 text-[15px] font-medium"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Sending..." : "Send message"}
                          </Button>

                          <p className="text-xs text-gray-400 text-center">
                            By submitting this form, you agree to our{" "}
                            <a href="/privacy" className="underline hover:text-gray-600">
                              Privacy Policy
                            </a>
                            .
                          </p>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
