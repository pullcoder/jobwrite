"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirm = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");
      const plan = searchParams.get("plan") ?? orderId?.split("_")[0];

      const res = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount), plan }),
      });

      setStatus(res.ok ? "success" : "error");
    };
    confirm();
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="text-red-500 font-bold text-xl mb-4">결제 처리 중 오류가 발생했습니다</p>
        <Link href="/upgrade" className="text-indigo-600 hover:underline">다시 시도하기</Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">결제가 완료됐습니다!</h1>
      <p className="text-gray-500 mb-8">이제 JobWrite의 모든 기능을 사용할 수 있습니다</p>
      <Link
        href="/write"
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        자소서 작성하러 가기
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
