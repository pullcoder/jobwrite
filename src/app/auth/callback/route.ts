export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    // 코드를 클라이언트 페이지로 넘겨서 브라우저가 세션 처리
    return NextResponse.redirect(`${origin}/auth/confirm?code=${code}`);
  }

  return NextResponse.redirect(`${origin}/mypage`);
}
