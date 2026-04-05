export const runtime = "edge";

import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = "https://nkhjhyywyvgydriihfvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raGpoeXl3eXZneWRyaWloZnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTY3OTUsImV4cCI6MjA5MDg3Mjc5NX0.bTRx5rIgmctjUNux4bZJIIua2ScTbZULd70Djly2CxA";

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  pro: Infinity,
  premium: Infinity,
};

export async function POST(req: NextRequest) {
  const { company, position, experience, strength, category, charLimit } = await req.json();

  if (!company || !position || !experience || !category) {
    return new Response(JSON.stringify({ error: "필수 입력값이 없습니다." }), { status: 400 });
  }

  // 로그인 유저 플랜 체크
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan ?? "free";
    const limit = PLAN_LIMITS[plan] ?? 1;

    if (limit !== Infinity) {
      const { count } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if ((count ?? 0) >= limit) {
        return new Response(
          JSON.stringify({ error: "limit_exceeded", plan, limit }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  const prompt = `당신은 취업 전문가이자 자기소개서 작성 전문가입니다.
아래 정보를 바탕으로 ${category} 항목의 자기소개서를 작성해 주세요.

[지원 정보]
- 지원 회사: ${company}
- 지원 직무: ${position}
- 관련 경험: ${experience}
- 강점: ${strength || "미입력"}
- 목표 글자 수: ${charLimit}자 내외

[작성 가이드]
1. 구체적인 경험과 수치를 활용하세요
2. ${company}의 기업 문화와 ${position} 직무에 맞는 키워드를 포함하세요
3. 두괄식 구조로 핵심 메시지를 먼저 제시하세요
4. 자연스럽고 진정성 있는 문체를 사용하세요
5. 반드시 ${charLimit}자 내외로 작성하세요

[${category}] 자기소개서를 지금 작성해 주세요:`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      stream: true,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("Anthropic error:", response.status, errText);
    return new Response(
      JSON.stringify({ error: "ai_error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch {
            // 파싱 오류 무시
          }
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
