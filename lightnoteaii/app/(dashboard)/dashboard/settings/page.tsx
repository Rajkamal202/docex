"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

// Settings sections for navigation
const settingsSections = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security & Privacy" },
  { id: "danger", label: "Account Actions" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")

  // Profile state
  const [profile, setProfile] = useState({
    name: "User Name",
    username: "username",
    email: "user@email.com",
    company: "",
    role: "",
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileSaved, setProfileSaved] = useState(false)

  // Account state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)

  // Notification state
  const [notifications, setNotifications] = useState({
    emailProposalUpdates: true,
    emailWeeklyDigest: true,
    emailProductUpdates: false,
    emailMarketing: false,
    inAppProposalAlerts: true,
    inAppSystemUpdates: true,
  })

  // Security state
  const [sessions] = useState([
    { id: "1", device: "MacBook Pro", location: "San Francisco, CA", lastActive: "Active now", current: true },
    { id: "2", device: "iPhone 14", location: "San Francisco, CA", lastActive: "2 hours ago", current: false },
    { id: "3", device: "Windows PC", location: "New York, NY", lastActive: "3 days ago", current: false },
  ])

  // Danger zone state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleProfileSave = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoutAllDevices = () => {
    // Implementation would go here
    alert("Logged out from all other devices")
  }

  return (
    <div className="flex gap-8 max-w-5xl">
      {/* Settings Navigation */}
      <aside className="w-48 shrink-0">
        <nav className="sticky top-6 space-y-1">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {section.label}
            </button>
          ))}

          {/* Billing Shortcut */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link
              href="/dashboard/billing"
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              Billing
              <svg
                className="h-3 w-3 ml-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Settings Content */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account preferences and settings</p>
        </div>

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update your personal details and profile picture</p>
              </div>

              <div className="p-5 space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-medium text-gray-400">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      Upload Photo
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      placeholder="Your company name"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="Your role or title"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-end gap-3">
                {profileSaved && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved
                  </span>
                )}
                <button
                  onClick={handleProfileSave}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Section */}
        {activeSection === "account" && (
          <div className="space-y-6">
            {/* Email */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Email Address</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your email address for account communications</p>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Primary email address</p>
                </div>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Password</h2>
                <p className="text-sm text-gray-500 mt-0.5">Update your password to keep your account secure</p>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">••••••••••••</p>
                  <p className="text-xs text-gray-500 mt-0.5">Last changed 30 days ago</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500 mt-0.5">Add an extra layer of security to your account</p>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${twoFactorEnabled ? "bg-green-100" : "bg-gray-100"}`}
                  >
                    <svg
                      className={`h-5 w-5 ${twoFactorEnabled ? "text-green-600" : "text-gray-400"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{twoFactorEnabled ? "Enabled" : "Not enabled"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {twoFactorEnabled ? "Your account is protected with 2FA" : "Protect your account with 2FA"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShow2FAModal(true)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    twoFactorEnabled
                      ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {twoFactorEnabled ? "Manage" : "Enable 2FA"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Email Notifications</h2>
                <p className="text-sm text-gray-500 mt-0.5">Choose what emails you want to receive</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    key: "emailProposalUpdates",
                    label: "Proposal Updates",
                    desc: "Get notified when your proposals are audited or updated",
                  },
                  {
                    key: "emailWeeklyDigest",
                    label: "Weekly Digest",
                    desc: "Receive a weekly summary of your proposal performance",
                  },
                  {
                    key: "emailProductUpdates",
                    label: "Product Updates",
                    desc: "Learn about new features and improvements",
                  },
                  { key: "emailMarketing", label: "Marketing Emails", desc: "Tips, guides, and promotional content" },
                ].map((item) => (
                  <div key={item.key} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        })
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* In-App Notifications */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">In-App Notifications</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage notifications within the dashboard</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    key: "inAppProposalAlerts",
                    label: "Proposal Alerts",
                    desc: "Real-time notifications for proposal activities",
                  },
                  {
                    key: "inAppSystemUpdates",
                    label: "System Updates",
                    desc: "Important announcements and maintenance notices",
                  },
                ].map((item) => (
                  <div key={item.key} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        })
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="space-y-6">
            {/* Active Sessions */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Manage devices where you're currently logged in</p>
                </div>
                <button
                  onClick={handleLogoutAllDevices}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Log Out All Devices
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <div key={session.id} className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          {session.device.includes("iPhone") ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{session.device}</p>
                          {session.current && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Privacy */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Data Privacy</h2>
                <p className="text-sm text-gray-500 mt-0.5">Control how your data is used and shared</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Your proposals remain private</p>
                    <p className="text-xs text-gray-500 mt-1">
                      We do not train AI models on your proposal data. Your documents are encrypted and stored securely.
                    </p>
                  </div>
                </div>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Download My Data</p>
                      <p className="text-xs text-gray-500 mt-0.5">Export all your account data in JSON format</p>
                    </div>
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone Section */}
        {activeSection === "danger" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-red-200 bg-red-50/50">
              <div className="p-5 border-b border-red-100">
                <h2 className="text-base font-semibold text-red-900">Danger Zone</h2>
                <p className="text-sm text-red-700/70 mt-0.5">Irreversible actions that affect your account</p>
              </div>
              <div className="divide-y divide-red-100">
                {/* Deactivate Account */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Deactivate Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Temporarily disable your account. You can reactivate anytime.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Deactivate
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delete Account</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-gray-900">Change Email Address</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your new email address. We'll send a verification link.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Email</label>
                <input
                  type="email"
                  placeholder="Enter new email"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Update Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a strong password with at least 8 characters.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {twoFactorEnabled ? "Manage Two-Factor Authentication" : "Enable Two-Factor Authentication"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {twoFactorEnabled
                ? "Manage your 2FA settings or disable two-factor authentication."
                : "Scan the QR code with your authenticator app to enable 2FA."}
            </p>
            {!twoFactorEnabled && (
              <div className="mt-4">
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <div className="h-40 w-40 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">QR Code</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter verification code</label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShow2FAModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {twoFactorEnabled ? (
                <button
                  onClick={() => {
                    setTwoFactorEnabled(false)
                    setShow2FAModal(false)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Disable 2FA
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTwoFactorEnabled(true)
                    setShow2FAModal(false)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Verify & Enable
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Deactivate Account</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your account will be temporarily disabled. You can reactivate it by logging in again.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg bg-amber-600 text-sm font-medium text-white hover:bg-amber-700 transition-colors">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Account Permanently</h2>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone. All your data, proposals, and history will be permanently deleted.
            </p>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Type <span className="font-mono text-red-600">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation("")
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmation !== "DELETE"}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
