export const runtime = "edge";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { company, position, category, content } = await req.json();

  if (!company || !position || !category || !content) {
    return new Response("필수 입력값이 없습니다.", { status: 400 });
  }

  const prompt = `당신은 10년 경력의 채용 전문가이자 자기소개서 첨삭 전문가입니다.
아래 자기소개서를 분석하고 구체적인 피드백을 제공해주세요.

[지원 정보]
- 지원 회사: ${company}
- 지원 직무: ${position}
- 항목: ${category}

[자기소개서]
${content}

아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{
  "score": 점수(0-100 사이 정수),
  "summary": "한 줄 총평 (20자 이내)",
  "strengths": ["강점1", "강점2", "강점3"],
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "tip": "합격률을 높이는 핵심 조언 (50자 이내)"
}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY!}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    return new Response("피드백 생성 중 오류가 발생했습니다.", { status: 500 });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 없음");
    const parsed = JSON.parse(jsonMatch[0]);
    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "피드백 파싱 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
