export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { paymentKey, orderId, amount, plan } = await req.json();

  // 토스페이먼츠 결제 승인
  const encoded = btoa(`${process.env.TOSS_SECRET_KEY}:`);
  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const payment = await response.json();

  // Supabase에 구독 정보 업데이트
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await Promise.all([
      supabase.from("profiles").update({ plan }).eq("id", user.id),
      supabase.from("subscriptions").upsert({
        user_id: user.id,
        plan,
        status: "active",
        expires_at: expiresAt.toISOString(),
        payment_key: paymentKey,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),
    ]);
  }

  return NextResponse.json({ success: true, payment });
}
