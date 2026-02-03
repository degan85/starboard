"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Check, Loader2, ArrowLeft } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "시작하기 좋은",
    features: [
      "프로젝트 1개",
      "후기 10개",
      "기본 위젯",
      "starboard 브랜딩",
    ],
    plan: "FREE",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "성장하는 비즈니스",
    features: [
      "프로젝트 3개",
      "후기 무제한",
      "커스텀 색상",
      "브랜딩 제거",
    ],
    plan: "PRO",
    popular: true,
  },
  {
    name: "Business",
    price: "$29",
    description: "모든 것을 원한다면",
    features: [
      "프로젝트 무제한",
      "영상 후기",
      "커스텀 도메인",
      "우선 지원",
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
        alert(data.error || "오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("오류가 발생했습니다.");
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
            대시보드로 돌아가기
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-brand-600 mb-4">
            <Heart className="w-8 h-8 fill-brand-500" />
            <span className="text-2xl font-bold">starboard</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            플랜 업그레이드
          </h1>
          <p className="text-gray-600">
            더 많은 기능이 필요하신가요? 딱 맞는 플랜을 선택하세요.
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
                  가장 인기
                </div>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                {plan.description}
              </p>
              <div className="my-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.popular ? "text-brand-200" : "text-gray-500"}>
                  /월
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
                    처리 중...
                  </>
                ) : plan.plan === "FREE" ? (
                  "현재 플랜"
                ) : (
                  `${plan.name} 시작하기`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">언제든 취소할 수 있나요?</h3>
              <p className="text-gray-600 text-sm">네, 언제든 취소 가능합니다. 취소 후에도 결제 기간이 끝날 때까지 사용할 수 있어요.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">환불 정책은 어떻게 되나요?</h3>
              <p className="text-gray-600 text-sm">구매 후 7일 이내 100% 환불해드립니다. 질문 없이요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
