"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Trash2, Download, Plus, Crown } from "lucide-react";

type Document = {
  id: string;
  company: string;
  position: string;
  category: string;
  content: string;
  created_at: string;
};

type Profile = {
  name: string | null;
  email: string;
  plan: string;
};

export default function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Document | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: profileData }, { data: docs }] = await Promise.all([
        supabase.from("profiles").select("name, email, plan").eq("id", user.id).single(),
        supabase.from("documents").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setProfile(profileData);
      setDocuments(docs ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("documents").delete().eq("id", id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleDownload = (doc: Document) => {
    const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.company}_${doc.category}_자소서.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 프로필 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">{profile?.name ?? "사용자"}</h1>
            <p className="text-sm text-gray-400">{profile?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${
              profile?.plan === "pro" ? "bg-indigo-100 text-indigo-700" :
              profile?.plan === "premium" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-500"
            }`}>
              {profile?.plan !== "free" && <Crown size={14} />}
              {profile?.plan?.toUpperCase() ?? "FREE"}
            </span>
            {profile?.plan === "free" && (
              <Link href="#pricing" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                업그레이드
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 자소서 목록 */}
          <div className="md:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">내 자소서 ({documents.length})</h2>
              <Link href="/write" className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
                <Plus size={14} />
                새 작성
              </Link>
            </div>

            {documents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <FileText size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">아직 작성한 자소서가 없어요</p>
                <Link href="/write" className="mt-4 inline-block text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
                  첫 자소서 작성하기
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelected(doc)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                      selected?.id === doc.id ? "border-indigo-400 shadow-sm" : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{doc.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{doc.category} · {doc.position}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {new Date(doc.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 자소서 내용 */}
          <div className="md:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{selected.company} · {selected.category}</h3>
                    <p className="text-sm text-gray-400">{selected.position}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(selected)}
                    className="flex items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download size={14} />
                    다운로드
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                  {selected.content}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FileText size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">왼쪽에서 자소서를 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
