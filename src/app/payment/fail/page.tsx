"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "결제가 취소되었습니다.";

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">결제에 실패했습니다</h1>
      <p className="text-gray-500 mb-8">{message}</p>
      <Link
        href="/upgrade"
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        다시 시도하기
      </Link>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={null}>
        <PaymentFailContent />
      </Suspense>
    </div>
  );
}
