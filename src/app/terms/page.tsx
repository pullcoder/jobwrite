export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">이용약관</h1>
        <p className="text-sm text-gray-400 mb-8">최종 수정일: 2025년 1월 1일</p>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">제1조 목적</h2>
            <p className="text-gray-600">이 약관은 JobWrite(이하 &quot;서비스&quot;)가 제공하는 AI 자기소개서 작성 서비스의 이용 조건 및 절차에 관한 사항을 규정합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">제2조 서비스 이용</h2>
            <p className="text-gray-600">회원은 서비스를 통해 생성된 자기소개서를 취업 목적으로 자유롭게 활용할 수 있습니다. 단, 생성된 콘텐츠를 상업적으로 재판매하는 것은 금지됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">제3조 결제 및 환불</h2>
            <p className="text-gray-600">구독 서비스는 매월 자동 결제되며, 다음 결제일 3일 전까지 해지 신청 시 다음 달부터 구독이 취소됩니다. 이미 결제된 금액은 환불되지 않습니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">제4조 면책</h2>
            <p className="text-gray-600">AI가 생성한 자기소개서의 취업 합격을 보장하지 않습니다. 최종 내용 검토 및 수정은 사용자 본인의 책임입니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
