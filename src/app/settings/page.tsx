"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Heart,
  ArrowLeft,
  User,
  CreditCard,
  Shield,
  LogOut,
  Loader2,
  Check,
  Crown,
  Zap,
} from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: "FREE" | "PRO" | "BUSINESS";
  stripeCurrentPeriodEnd: string | null;
  createdAt: string;
  _count: { projects: number };
  testimonialCount: number;
}

const planDetails = {
  FREE: {
    name: "Free",
    color: "bg-gray-100 text-gray-700",
    icon: User,
    limits: { projects: 1, testimonials: 10 },
  },
  PRO: {
    name: "Pro",
    color: "bg-brand-100 text-brand-700",
    icon: Zap,
    limits: { projects: 3, testimonials: "Unlimited" },
  },
  BUSINESS: {
    name: "Business",
    color: "bg-yellow-100 text-yellow-700",
    icon: Crown,
    limits: { projects: "Unlimited", testimonials: "Unlimited" },
  },
};

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data.user);
      setName(data.user?.name || "");
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load user data</p>
      </div>
    );
  }

  const plan = planDetails[user.plan];
  const PlanIcon = plan.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-600">
            <Heart className="w-6 h-6 fill-brand-500" />
            starboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </div>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-brand-600">
                      {(user.name || user.email)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Plan & Billing</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${plan.color}`}>
                  <PlanIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{plan.name} Plan</p>
                  {user.stripeCurrentPeriodEnd && (
                    <p className="text-sm text-gray-500">
                      Renews on {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {user.plan === "FREE" ? (
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition text-sm font-medium"
                >
                  Upgrade Plan
                </Link>
              ) : (
                <button
                  onClick={handleManageBilling}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  Manage Billing
                </button>
              )}
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user._count.projects}
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {plan.limits.projects}
                  </span>
                </p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.testimonialCount}
                  <span className="text-sm font-normal text-gray-400">
                    {" "}/ {plan.limits.testimonials}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Account</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Member since</p>
                  <p className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Sign out</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm"
              onClick={() => {
                if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  // TODO: Implement account deletion
                  alert("Account deletion coming soon");
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
