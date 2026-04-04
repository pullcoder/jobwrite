export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-gray-400 mb-8">최종 수정일: 2025년 1월 1일</p>
        <div className="prose prose-gray max-w-none text-sm leading-relaxed space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. 수집하는 개인정보</h2>
            <p className="text-gray-600">JobWrite는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다: 이메일 주소, 이름, 자기소개서 작성 시 입력한 정보(회사명, 직무, 경험 등).</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. 개인정보 이용 목적</h2>
            <p className="text-gray-600">수집한 개인정보는 자기소개서 생성 서비스 제공, 회원 관리, 서비스 개선에만 사용됩니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. 개인정보 보유 기간</h2>
            <p className="text-gray-600">회원 탈퇴 시 즉시 삭제하며, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. 문의</h2>
            <p className="text-gray-600">개인정보 관련 문의: support@jobwrite.ai</p>
          </section>
        </div>
      </div>
    </div>
  );
}
