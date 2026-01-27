import Link from "next/link"
import { FileText, Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <p className="text-[22px] font-medium mb-0.5">Proposal intelligence</p>
            <p className="text-[22px] text-[#6b7280] mb-8">for teams that care about winning.</p>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center">
                <FileText className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold">LightNote AI</span>
            </Link>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-[#9ca3af] text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Talk to Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-[#9ca3af] text-sm">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Partnership</h4>
            <ul className="space-y-3 text-[#9ca3af] text-sm">
              <li>
                <Link href="/agencies" className="hover:text-white transition-colors">
                  Agencies
                </Link>
              </li>
              <li>
                <Link href="/creators" className="hover:text-white transition-colors">
                  Creators
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-white transition-colors">
                  Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-medium mb-4 text-sm">Follow Us</h4>
            <ul className="space-y-3 text-[#9ca3af] text-sm">
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Twitter className="h-4 w-4" strokeWidth={1.5} />
                  x.com
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.5} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" strokeWidth={1.5} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#333] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#6b7280]">
          <p>&copy; {new Date().getFullYear()} LightNote AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Services
            </Link>
            <Link href="/imprint" className="hover:text-white transition-colors">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
