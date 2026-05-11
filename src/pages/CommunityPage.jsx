import { useState } from "react";
import Header from "../components/organisms/Header";

const POSTS = [
  {
    id: 1,
    title: "제 1회 MOV:ON 시네마틱 숏필름 페스티벌 개최",
    author: "MOV:ON Official",
    date: "2026.05.08",
    category: "공지사항",
    views: 1240,
    likes: 450,
    isNotice: true
  },
  {
    id: 2,
    title: "로케이션 공유: 인천 폐창고의 몽환적인 분위기",
    author: "이준기 감독",
    date: "2026.05.09",
    category: "제작 팁",
    views: 850,
    likes: 128,
    isNotice: false
  },
  {
    id: 3,
    title: "촬영 장비 대여 및 품앗이 하실 분 찾습니다",
    author: "박서연",
    date: "2026.05.09",
    category: "구인구직",
    views: 420,
    likes: 56,
    isNotice: false
  },
  {
    id: 4,
    title: "신작 '차가운 빛' 편집 피드백 부탁드려요",
    author: "임재욱",
    date: "2026.05.07",
    category: "자유게시판",
    views: 670,
    likes: 89,
    isNotice: false
  }
];

const EVENTS = [
  {
    id: 1,
    title: "독립영화인의 밤",
    desc: "서로의 작품을 나누고 네트워킹하는 시간",
    date: "2026.05.20",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    status: "모집중"
  },
  {
    id: 2,
    title: "시나리오 워크숍",
    desc: "전문 멘토와 함께하는 대본 리딩 세션",
    date: "2026.05.25",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    status: "마감임박"
  }
];

const CommunityPage = () => {
  const [activeCategory, setActiveCategory] = useState("전체");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <div className="max-w-7xl mx-auto py-16 px-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
        {/* Main Feed */}
        <div className="space-y-12">
          <header className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter">Community</h1>
            <div className="flex gap-4">
              {["전체", "공지사항", "자유게시판", "제작 팁", "구인구직"].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-4">
            {POSTS.map(post => (
              <div key={post.id} className="group p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-amber-500/30 transition cursor-pointer flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${post.isNotice ? 'bg-amber-500 text-black' : 'bg-white/10 text-zinc-500'}`}>
                      {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-black group-hover:text-amber-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{post.author}</p>
                </div>
                <div className="flex gap-6 text-zinc-600 font-bold text-[11px]">
                  <span className="flex items-center gap-1">👁️ {post.views}</span>
                  <span className="flex items-center gap-1">🤍 {post.likes}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-center">
             <button className="text-[11px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">Load More Posts</button>
          </div>
        </div>

        {/* Sidebar / Events */}
        <aside className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl font-black tracking-tight">Active Events</h2>
            <div className="space-y-4">
              {EVENTS.map(event => (
                <div key={event.id} className="relative aspect-square rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end gap-2">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{event.status}</span>
                    <h4 className="text-xl font-black tracking-tight">{event.title}</h4>
                    <p className="text-[10px] font-bold text-zinc-400">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="p-8 bg-amber-500 rounded-3xl text-black space-y-4 shadow-2xl shadow-amber-500/10">
            <h4 className="text-lg font-black tracking-tight leading-tight">창작자를 위한<br />제작 지원 프로젝트</h4>
            <p className="text-[11px] font-bold opacity-70">여러분의 시나리오를 등록하고 MOV:ON의 제작 지원을 받아보세요.</p>
            <button className="w-full py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-900 transition">
              지원하기
            </button>
          </section>
        </aside>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        main {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default CommunityPage;
