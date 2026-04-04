export const runtime = "edge";

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { company, position, experience, strength, category, charLimit } = await req.json();

  if (!company || !position || !experience || !category) {
    return new Response("필수 입력값이 없습니다.", { status: 400 });
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

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
