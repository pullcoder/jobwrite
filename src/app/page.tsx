import Link from "next/link";
import { Sparkles, FileText, Target, Clock, CheckCircle, ChevronDown } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    title: "AI 맞춤 자소서 생성",
    desc: "지원 회사와 직무에 최적화된 자기소개서를 AI가 즉시 작성합니다.",
  },
  {
    icon: <Target className="w-6 h-6 text-indigo-600" />,
    title: "합격률 최적화",
    desc: "수천 건의 합격 자소서를 학습한 AI가 핵심 키워드와 구조를 분석합니다.",
  },
  {
    icon: <FileText className="w-6 h-6 text-indigo-600" />,
    title: "항목별 맞춤 작성",
    desc: "성장과정, 지원동기, 직무역량 등 각 항목에 맞는 내용을 자동 생성합니다.",
  },
  {
    icon: <Clock className="w-6 h-6 text-indigo-600" />,
    title: "3분 안에 완성",
    desc: "기업명과 직무, 경험만 입력하면 완성된 자소서가 3분 안에 완성됩니다.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "처음 시작하는 분들을 위해",
    features: ["월 1회 자소서 생성", "기본 템플릿 제공", "PDF 다운로드"],
    cta: "무료로 시작",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19,900",
    desc: "취업 준비생에게 최적",
    features: ["무제한 자소서 생성", "AI 첨삭 및 개선 제안", "맞춤 키워드 추천", "PDF / 워드 다운로드", "이력서 연동"],
    cta: "Pro 시작하기",
    highlight: true,
  },
  {
    name: "Premium",
    price: "39,900",
    desc: "완벽한 취업 준비",
    features: ["Pro 모든 기능 포함", "면접 예상 질문 생성", "회사별 맞춤 전략", "1:1 피드백 리포트", "우선 고객 지원"],
    cta: "Premium 시작하기",
    highlight: false,
  },
];

const faqs = [
  {
    q: "자소서 생성에 얼마나 걸리나요?",
    a: "기업명, 직무, 간단한 경험을 입력하면 평균 1~3분 내에 완성된 자소서가 생성됩니다.",
  },
  {
    q: "생성된 자소서를 수정할 수 있나요?",
    a: "네, 생성된 자소서는 에디터에서 자유롭게 수정 가능하며 AI 추가 개선도 요청할 수 있습니다.",
  },
  {
    q: "어떤 회사에 지원할 때 써도 되나요?",
    a: "대기업, 중소기업, 스타트업, 공기업 등 모든 유형의 기업에 맞춤형으로 생성 가능합니다.",
  },
  {
    q: "개인정보는 안전하게 관리되나요?",
    a: "입력한 정보는 자소서 생성에만 활용되며, 암호화하여 안전하게 관리됩니다.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={14} />
            AI 자소서 생성 서비스 #1
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            합격하는 자소서,<br />
            <span className="text-indigo-600">3분</span>이면 충분합니다
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI가 당신의 경험을 분석해 지원 회사에 최적화된 자기소개서를 즉시 작성합니다.
            더 이상 빈 화면 앞에서 고민하지 마세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/write"
              className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              무료로 자소서 작성하기 →
            </Link>
            <Link
              href="#features"
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-bold text-lg border border-gray-200 hover:border-indigo-300 transition-all"
            >
              기능 살펴보기
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">신용카드 불필요 · 무료로 시작</p>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 text-center">
          {[
            { num: "10,000+", label: "생성된 자소서" },
            { num: "89%", label: "서류 합격률" },
            { num: "3분", label: "평균 생성 시간" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-black text-indigo-600">{s.num}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              왜 JobWrite인가요?
            </h2>
            <p className="text-gray-500 text-lg">취업 준비의 가장 힘든 부분을 AI가 해결합니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-8 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              이렇게 사용하세요
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "정보 입력", desc: "회사명, 직무, 나의 경험을 간단히 입력합니다" },
              { step: "02", title: "AI 분석", desc: "AI가 지원 회사에 최적화된 자소서를 생성합니다" },
              { step: "03", title: "완성 & 제출", desc: "수정 후 바로 다운로드하여 제출하세요" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              합리적인 요금제
            </h2>
            <p className="text-gray-500 text-lg">합격할 때까지, 부담 없이 사용하세요</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border-2 flex flex-col ${
                  plan.highlight
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-xl scale-105"
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
                  ₩{plan.price}
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
                <Link
                  href="/write"
                  className={`text-center py-3 rounded-xl font-bold transition-all ${
                    plan.highlight
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-2xl border border-gray-100 p-6">
                <summary className="flex items-center justify-between cursor-pointer font-bold text-gray-900 list-none">
                  {faq.q}
                  <ChevronDown size={20} className="text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-gray-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-indigo-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-indigo-200 text-lg mb-10">
            무료로 첫 자소서를 작성하고 합격의 첫 걸음을 내딛으세요
          </p>
          <Link
            href="/write"
            className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-black text-lg hover:bg-indigo-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            무료로 자소서 작성하기 →
          </Link>
        </div>
      </section>
    </div>
  );
}
