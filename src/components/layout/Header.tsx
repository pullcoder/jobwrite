"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600">JobWrite</span>
            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">기능</Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">요금제</Link>
            <Link href="#faq" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">FAQ</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/mypage"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <User size={16} />
                  마이페이지
                </Link>
                <Link
                  href="/write"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  자소서 작성
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">로그인</Link>
                <Link
                  href="/write"
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  무료로 시작하기
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          <Link href="#features" className="text-sm text-gray-600">기능</Link>
          <Link href="#pricing" className="text-sm text-gray-600">요금제</Link>
          <Link href="#faq" className="text-sm text-gray-600">FAQ</Link>
          {user ? (
            <>
              <Link href="/mypage" className="text-sm text-gray-600">마이페이지</Link>
              <Link href="/write" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg text-center font-medium">
                자소서 작성
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-400 text-left">로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600">로그인</Link>
              <Link href="/write" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg text-center font-medium">
                무료로 시작하기
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
