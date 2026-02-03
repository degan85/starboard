"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Check, Loader2, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect to start",
    features: [
      "1 project",
      "10 testimonials",
      "Basic widget",
      "starboard branding",
    ],
    plan: "FREE",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For growing businesses",
    features: [
      "3 projects",
      "Unlimited testimonials",
      "Custom colors",
      "Remove branding",
    ],
    plan: "PRO",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    description: "For serious teams",
    features: [
      "Unlimited projects",
      "Video testimonials",
      "Custom domain",
      "Priority support",
    ],
    plan: "BUSINESS",
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    if (plan === "FREE") return;
    
    setLoading(plan);
    
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-brand-600 mb-4">
            <Heart className="w-8 h-8 fill-brand-500" />
            <span className="text-2xl font-bold">starboard</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upgrade your plan
          </h1>
          <p className="text-gray-600">
            Need more features? Choose the plan that's right for you.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 ${
                plan.popular
                  ? "bg-brand-600 text-white ring-4 ring-brand-600 ring-offset-2"
                  : "bg-white border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="text-brand-200 text-sm font-medium mb-2">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                {plan.description}
              </p>
              <div className="my-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                  /mo
                </span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check className={`w-5 h-5 ${plan.popular ? "text-brand-200" : "text-brand-600"}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.plan)}
                disabled={loading !== null || plan.plan === "FREE"}
                className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-white text-brand-600 hover:bg-brand-50"
                    : plan.plan === "FREE"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                } disabled:opacity-50`}
              >
                {loading === plan.plan ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : plan.plan === "FREE" ? (
                  "Current Plan"
                ) : (
                  `Start ${plan.name}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">Yes, you can cancel at any time. You'll keep access until the end of your billing period.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">What's your refund policy?</h3>
              <p className="text-gray-600 text-sm">Full refund within 7 days of purchase. No questions asked.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
