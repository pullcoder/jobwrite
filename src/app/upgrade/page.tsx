"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Crown, Sparkles } from "lucide-react";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 19900,
    desc: "취업 준비생에게 최적",
    features: ["무제한 자소서 생성", "AI 첨삭 및 개선 제안", "맞춤 키워드 추천", "PDF / 워드 다운로드", "이력서 연동"],
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 39900,
    desc: "완벽한 취업 준비",
    features: ["Pro 모든 기능 포함", "면접 예상 질문 생성", "회사별 맞춤 전략", "1:1 피드백 리포트", "우선 고객 지원"],
    highlight: false,
  },
];

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUserId(data.user.id);
      setUserEmail(data.user.email ?? null);
    });
  }, []);

  const handlePayment = async (plan: typeof PLANS[0]) => {
    if (!userId || !userEmail) return;
    setLoading(plan.id);

    try {
      const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      const payment = tossPayments.payment({ customerKey: userId });

      const orderId = `${plan.id}_${userId}_${Date.now()}`;

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: plan.price },
        orderId,
        orderName: `JobWrite ${plan.name} 구독`,
        customerEmail: userEmail ?? undefined,
        successUrl: `${location.origin}/payment/success?plan=${plan.id}`,
        failUrl: `${location.origin}/payment/fail`,
      });
    } catch (e) {
      console.error(e);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Crown size={14} />
            플랜 업그레이드
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">합격을 위한 투자</h1>
          <p className="text-gray-500">무제한으로 자소서를 작성하고 합격률을 높이세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-8 border-2 flex flex-col ${
                plan.highlight
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-xl"
                  : "border-gray-100 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full w-fit mb-4">
                  가장 인기
                </div>
              )}
              <h3 className={`text-xl font-black mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-4 ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}>{plan.desc}</p>
              <div className={`text-4xl font-black mb-6 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                ₩{plan.price.toLocaleString()}
                <span className={`text-sm font-normal ml-1 ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}>/월</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className={plan.highlight ? "text-indigo-200" : "text-indigo-500"} />
                    <span className={plan.highlight ? "text-indigo-100" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePayment(plan)}
                disabled={loading !== null}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all disabled:opacity-60 ${
                  plan.highlight
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                <Sparkles size={16} />
                {loading === plan.id ? "처리 중..." : `${plan.name} 시작하기`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다 · 언제든지 해지 가능
        </p>
      </div>
    </div>
  );
}
