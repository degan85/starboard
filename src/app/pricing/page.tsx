"use client";

import { useState, useEffect } from "react";
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
  const [currentPlan, setCurrentPlan] = useState<string>("FREE");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      if (data.user?.plan) {
        setCurrentPlan(data.user.plan);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (plan === currentPlan) return;
    if (plan === "FREE") return;
    
    setLoading(plan);
    
    try {
      const response = await fetch("/api/payments/checkout", {
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

  const getButtonText = (plan: string) => {
    if (plan === currentPlan) return "Current Plan";
    if (plan === "FREE") return "Free Plan";
    
    const planOrder = { FREE: 0, PRO: 1, BUSINESS: 2 };
    if (planOrder[plan as keyof typeof planOrder] < planOrder[currentPlan as keyof typeof planOrder]) {
      return "Downgrade"; // Can't downgrade directly, go to settings
    }
    return `Upgrade to ${plan === "PRO" ? "Pro" : "Business"}`;
  };

  const isButtonDisabled = (plan: string) => {
    if (loading !== null) return true;
    if (plan === currentPlan) return true;
    if (plan === "FREE") return true;
    
    // Can't downgrade directly
    const planOrder = { FREE: 0, PRO: 1, BUSINESS: 2 };
    if (planOrder[plan as keyof typeof planOrder] < planOrder[currentPlan as keyof typeof planOrder]) {
      return true;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

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
            {currentPlan === "FREE" ? "Upgrade your plan" : "Manage your plan"}
          </h1>
          <p className="text-gray-600">
            {currentPlan === "FREE" 
              ? "Need more features? Choose the plan that's right for you."
              : `You're currently on the ${currentPlan} plan.`}
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.plan === currentPlan;
            
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 relative ${
                  isCurrent
                    ? "ring-4 ring-green-500 ring-offset-2 bg-white border border-green-200"
                    : plan.popular
                    ? "bg-brand-600 text-white ring-4 ring-brand-600 ring-offset-2"
                    : "bg-white border border-gray-200"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CURRENT
                  </div>
                )}
                {plan.popular && !isCurrent && (
                  <div className="text-brand-200 text-sm font-medium mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${isCurrent ? "text-gray-900" : ""}`}>
                  {plan.name}
                </h3>
                <p className={isCurrent ? "text-gray-500" : plan.popular ? "text-brand-200" : "text-gray-500"}>
                  {plan.description}
                </p>
                <div className="my-4">
                  <span className={`text-4xl font-bold ${isCurrent ? "text-gray-900" : ""}`}>
                    {plan.price}
                  </span>
                  <span className={isCurrent ? "text-gray-500" : plan.popular ? "text-brand-200" : "text-gray-500"}>
                    /mo
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-2 ${isCurrent ? "text-gray-700" : ""}`}>
                      <Check className={`w-5 h-5 ${
                        isCurrent ? "text-green-500" : plan.popular ? "text-brand-200" : "text-brand-600"
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(plan.plan)}
                  disabled={isButtonDisabled(plan.plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    isCurrent
                      ? "bg-green-100 text-green-700 cursor-default"
                      : plan.popular
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
                  ) : (
                    getButtonText(plan.plan)
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Downgrade notice */}
        {currentPlan !== "FREE" && (
          <p className="text-center text-sm text-gray-500 mt-6">
            To downgrade or cancel, go to{" "}
            <Link href="/settings" className="text-brand-600 hover:underline">
              Settings
            </Link>
          </p>
        )}

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
