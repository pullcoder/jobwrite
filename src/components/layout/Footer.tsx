import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <span className="text-2xl font-black text-white">JobWrite</span>
            <p className="mt-2 text-sm leading-relaxed">
              AI가 당신의 이야기를 가장 빛나는 자기소개서로 만들어 드립니다.
              합격을 향한 첫 걸음을 함께하세요.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/write" className="hover:text-white transition-colors">자소서 작성</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">주요 기능</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">요금제</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-xs text-center">
          © 2025 JobWrite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
