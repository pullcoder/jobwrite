"use client";

import { useState, useEffect } from "react";
import { Sparkles, Copy, Download, RotateCcw, ChevronRight, Save, TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const CATEGORIES = ["성장과정", "지원동기", "직무역량", "입사 후 포부", "성격 장단점"];

type FormData = {
  company: string;
  position: string;
  experience: string;
  strength: string;
  category: string;
  charLimit: string;
};

type Feedback = {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  tip: string;
};

const INITIAL_FORM: FormData = {
  company: "",
  position: "",
  experience: "",
  strength: "",
  category: "지원동기",
  charLimit: "1000",
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-400";
  const bg = score >= 80 ? "bg-green-50" : score >= 60 ? "bg-yellow-50" : "bg-red-50";
  return (
    <div className={`w-20 h-20 rounded-full ${bg} flex flex-col items-center justify-center`}>
      <span className={`text-2xl font-black ${color}`}>{score}</span>
      <span className="text-xs text-gray-400">/ 100</span>
    </div>
  );
}

export default function WritePage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState<"form" | "result">("form");
  const [userId, setUserId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fetchFeedback = async (content: string) => {
    setFeedbackLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company,
          position: form.position,
          category: form.category,
          content,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFeedback(data);
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setSaved(false);
    setFeedback(null);
    setLimitExceeded(false);
    setStep("result");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 403) {
        setLimitExceeded(true);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("생성 실패");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("스트림 없음");

      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setResult(fullText);
      }

      if (userId) {
        await supabase.from("documents").insert({
          user_id: userId,
          company: form.company,
          position: form.position,
          category: form.category,
          experience: form.experience,
          strength: form.strength,
          char_limit: Number(form.charLimit),
          content: fullText,
        });
        setSaved(true);
      }

      await fetchFeedback(fullText);
    } catch {
      setResult("자소서 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStep("form");
    setResult("");
    setSaved(false);
    setFeedback(null);
    setLimitExceeded(false);
    setForm(INITIAL_FORM);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.company}_${form.category}_자소서.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} />
            AI 자소서 생성기
          </div>
          <h1 className="text-3xl font-black text-gray-900">자기소개서 작성</h1>
          <p className="text-gray-500 mt-2">정보를 입력하면 AI가 맞춤형 자소서를 작성합니다</p>
          {!userId && (
            <p className="text-xs text-amber-600 bg-amber-50 px-4 py-2 rounded-lg mt-3 inline-block">
              로그인하면 생성된 자소서가 자동으로 저장됩니다
            </p>
          )}
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">지원 회사명 *</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="예) 삼성전자, 카카오, 현대자동차"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">지원 직무 *</label>
                <input
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                  placeholder="예) 프론트엔드 개발자, 마케터, 기획자"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">관련 경험 *</label>
              <textarea
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
                rows={4}
                placeholder="예) React를 활용한 쇼핑몰 프로젝트 6개월, IT 스타트업 인턴 3개월..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">본인의 강점</label>
              <input
                name="strength"
                value={form.strength}
                onChange={handleChange}
                placeholder="예) 문제해결력, 커뮤니케이션, 주도적, 꼼꼼함"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">자소서 항목 *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">글자 수 제한</label>
                <select
                  name="charLimit"
                  value={form.charLimit}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  {["500", "700", "1000", "1500", "2000"].map((n) => (
                    <option key={n} value={n}>{Number(n).toLocaleString()}자</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              AI 자소서 생성하기
              <ChevronRight size={18} />
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* 자소서 본문 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {form.company} · {form.category}
                  </h2>
                  <p className="text-sm text-gray-400">{form.position}</p>
                </div>
                <div className="flex items-center gap-2">
                  {saved && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      <Save size={12} />
                      저장됨
                    </span>
                  )}
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw size={14} />
                    다시 작성
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={loading || !result}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-40"
                  >
                    <Copy size={14} />
                    {copied ? "복사됨!" : "복사"}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={loading || !result}
                    className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
                  >
                    <Download size={14} />
                    다운로드
                  </button>
                </div>
              </div>

              {limitExceeded ? (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 text-center border border-indigo-100">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown size={28} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">무료 자소서를 모두 사용했습니다</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    무료 플랜은 자소서 1회 생성을 제공합니다.<br />
                    Pro로 업그레이드하면 무제한으로 생성할 수 있습니다.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/upgrade"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Crown size={16} />
                      Pro로 업그레이드
                    </Link>
                    <button
                      onClick={handleReset}
                      className="text-gray-500 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                    >
                      돌아가기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-h-64 bg-gray-50 rounded-xl p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {loading && !result && (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      AI가 자소서를 작성하고 있습니다...
                    </div>
                  )}
                  {result}
                  {loading && result && (
                    <span className="inline-block w-1 h-4 bg-indigo-500 animate-pulse ml-1" />
                  )}
                </div>
              )}

              {!loading && result && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{result.length.toLocaleString()}자</p>
                  <p className="text-xs text-gray-400">목표: {Number(form.charLimit).toLocaleString()}자</p>
                </div>
              )}
            </div>

            {/* AI 피드백 */}
            {(feedbackLoading || feedback) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={18} className="text-indigo-600" />
                  <h3 className="text-lg font-bold text-gray-900">AI 피드백</h3>
                </div>

                {feedbackLoading ? (
                  <div className="flex items-center gap-3 text-gray-400 py-4">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">자소서를 분석하고 있습니다...</span>
                  </div>
                ) : feedback && (
                  <div className="space-y-6">
                    {/* 점수 + 총평 */}
                    <div className="flex items-center gap-5">
                      <ScoreRing score={feedback.score} />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">종합 점수</p>
                        <p className="font-bold text-gray-900">{feedback.summary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* 강점 */}
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-sm font-bold text-green-800">잘된 점</span>
                        </div>
                        <ul className="space-y-2">
                          {feedback.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 개선점 */}
                      <div className="bg-amber-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle size={16} className="text-amber-600" />
                          <span className="text-sm font-bold text-amber-800">개선할 점</span>
                        </div>
                        <ul className="space-y-2">
                          {feedback.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 핵심 조언 */}
                    <div className="bg-indigo-50 rounded-xl p-4 flex items-start gap-3">
                      <Lightbulb size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-indigo-800">{feedback.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
