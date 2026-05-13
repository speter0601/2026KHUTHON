import { useState, useMemo } from "react";

const POSTS = [
  // 공지사항
  { id:1,  title:"제 1회 MOV:ON 시네마틱 숏필름 페스티벌 개최", author:"MOV:ON Official", date:"2026.05.08", category:"공지사항", views:3240, likes:850, isNotice:true },
  { id:2,  title:"[필독] 콘텐츠 업로드 정책 업데이트 안내", author:"MOV:ON Official", date:"2026.05.05", category:"공지사항", views:2810, likes:320, isNotice:true },
  { id:3,  title:"2026년 상반기 우수 창작자 선정 결과 발표", author:"MOV:ON Official", date:"2026.04.28", category:"공지사항", views:1950, likes:612, isNotice:true },
  { id:4,  title:"MOV:ON 앱 v2.3 업데이트 — 새로운 피드백 기능 출시", author:"MOV:ON Official", date:"2026.04.20", category:"공지사항", views:1420, likes:275, isNotice:true },
  { id:5,  title:"독립영화 후원 캠페인 '씨앗' 파트너 모집", author:"MOV:ON Official", date:"2026.04.10", category:"공지사항", views:980, likes:198, isNotice:true },

  // 자유게시판
  { id:6,  title:"신작 '차가운 빛' 편집 피드백 부탁드려요", author:"임재욱", date:"2026.05.07", category:"자유게시판", views:670, likes:89, isNotice:false },
  { id:7,  title:"독립영화 제작하면서 가장 힘들었던 순간 공유해요", author:"김소율", date:"2026.05.06", category:"자유게시판", views:1130, likes:203, isNotice:false },
  { id:8,  title:"영화 '파도를 따라서' 보고 눈물 펑펑 쏟았습니다", author:"최다현", date:"2026.05.05", category:"자유게시판", views:890, likes:156, isNotice:false },
  { id:9,  title:"단편영화 촬영 중 배우가 갑자기 빠졌을 때 어떻게 하셨나요?", author:"박준혁", date:"2026.05.04", category:"자유게시판", views:540, likes:72, isNotice:false },
  { id:10, title:"MOV:ON 덕분에 처음으로 영화 완성했어요! 후기 공유", author:"이서하", date:"2026.05.03", category:"자유게시판", views:1620, likes:418, isNotice:false },
  { id:11, title:"요즘 국내 독립영화 트렌드가 어떻게 변하고 있는 것 같나요?", author:"정우진", date:"2026.05.02", category:"자유게시판", views:730, likes:94, isNotice:false },
  { id:12, title:"영화 촬영하면서 생긴 웃픈 에피소드 모음", author:"한지수", date:"2026.05.01", category:"자유게시판", views:2100, likes:387, isNotice:false },

  // 제작 팁
  { id:13, title:"로케이션 공유: 인천 폐창고의 몽환적인 분위기", author:"이준기 감독", date:"2026.05.09", category:"제작 팁", views:850, likes:128, isNotice:false },
  { id:14, title:"저예산으로 영화 같은 조명 만드는 법 — DIY 조명 세팅", author:"오세린", date:"2026.05.08", category:"제작 팁", views:2430, likes:512, isNotice:false },
  { id:15, title:"스마트폰으로 찍는 시네마틱 영상 — 앵글과 렌즈 선택 가이드", author:"강민주", date:"2026.05.07", category:"제작 팁", views:3100, likes:680, isNotice:false },
  { id:16, title:"색보정(DaVinci Resolve) 무료 LUT 패키지 공유합니다", author:"서도윤", date:"2026.05.06", category:"제작 팁", views:4200, likes:920, isNotice:false },
  { id:17, title:"현장 사운드 녹음 실패 없이 하는 방법 — 마이크 배치 꿀팁", author:"정유진", date:"2026.05.05", category:"제작 팁", views:1870, likes:334, isNotice:false },
  { id:18, title:"배우 없이 리허설 연습하는 법 — 스토리보드 활용기", author:"박해진", date:"2026.05.04", category:"제작 팁", views:960, likes:142, isNotice:false },
  { id:19, title:"야외 촬영 시 갑작스러운 날씨 변화 대처법", author:"최윤서", date:"2026.05.03", category:"제작 팁", views:1240, likes:208, isNotice:false },
  { id:20, title:"편집 템포로 감정 조율하기 — 컷의 리듬 이론 정리", author:"임채민", date:"2026.05.02", category:"제작 팁", views:1580, likes:293, isNotice:false },

  // 구인구직
  { id:21, title:"촬영 장비 대여 및 품앗이 하실 분 찾습니다", author:"박서연", date:"2026.05.09", category:"구인구직", views:420, likes:56, isNotice:false },
  { id:22, title:"[구인] 단편 공포영화 촬영감독 모집 — 5월 말 촬영 예정", author:"이강우", date:"2026.05.08", category:"구인구직", views:680, likes:41, isNotice:false },
  { id:23, title:"[구직] 조명 스태프 가능합니다 — 경력 2년", author:"윤서아", date:"2026.05.08", category:"구인구직", views:310, likes:28, isNotice:false },
  { id:24, title:"[구인] 시나리오 공동 작업자 모집 — 드라마 장르 선호", author:"한소희", date:"2026.05.07", category:"구인구직", views:520, likes:63, isNotice:false },
  { id:25, title:"[구직] 편집 가능합니다 — Premiere Pro/DaVinci Resolve 가능", author:"김도윤", date:"2026.05.07", category:"구인구직", views:740, likes:87, isNotice:false },
  { id:26, title:"[구인] 다큐멘터리 인터뷰이 섭외 도움 요청합니다", author:"정승우", date:"2026.05.06", category:"구인구직", views:290, likes:32, isNotice:false },
  { id:27, title:"[품앗이] 촬영 도와드릴게요, 편집 도움 주실 분!", author:"송하늘", date:"2026.05.06", category:"구인구직", views:460, likes:74, isNotice:false },
  { id:28, title:"[구인] 뮤직비디오 감독 모집 — 아이돌 소속사 협업 건", author:"임하늘", date:"2026.05.05", category:"구인구직", views:1830, likes:215, isNotice:false },
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
  },
  {
    id: 3,
    title: "숏필름 페스티벌",
    desc: "신진 감독의 단편을 한자리에서",
    date: "2026.06.01",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80",
    status: "모집예정"
  },
];

const CATEGORIES = ["전체", "공지사항", "자유게시판", "제작 팁", "구인구직"];

const CommunityPage = () => {
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = useMemo(() =>
    activeCategory === "전체"
      ? POSTS
      : POSTS.filter(p => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto py-16 px-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-16">
        {/* Main Feed */}
        <div className="space-y-10">
          <header className="space-y-5">
            <h1 className="text-5xl font-black tracking-tighter">Community</h1>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-white text-black scale-105"
                      : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                  <span className={`ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeCategory === cat ? "bg-black/20 text-black" : "bg-white/10 text-zinc-600"}`}>
                    {cat === "전체" ? POSTS.length : POSTS.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-3">
            {filtered.map((post, idx) => (
              <div
                key={post.id}
                style={{ animationDelay: `${idx * 30}ms` }}
                className="group p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shrink-0 ${
                      post.isNotice
                        ? "bg-amber-500 text-black"
                        : post.category === "제작 팁" ? "bg-sky-500/20 text-sky-400"
                        : post.category === "구인구직" ? "bg-emerald-500/20 text-emerald-400"
                        : post.category === "자유게시판" ? "bg-purple-500/20 text-purple-400"
                        : "bg-white/10 text-zinc-500"
                    }`}>
                      {post.category}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">{post.date}</span>
                  </div>
                  <h3 className="text-base font-black group-hover:text-amber-500 transition-colors truncate pr-4">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{post.author}</p>
                </div>
                <div className="flex gap-5 text-zinc-600 font-bold text-[11px] shrink-0">
                  <span className="flex items-center gap-1">👁 {post.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1">🤍 {post.likes.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex justify-center">
            <button className="text-[11px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">
              Load More Posts
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
          <section className="space-y-5">
            <h2 className="text-xl font-black tracking-tight">Active Events</h2>
            <div className="space-y-4">
              {EVENTS.map(event => (
                <div key={event.id} className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-white/5">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end gap-1">
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{event.status}</span>
                    <h4 className="text-lg font-black tracking-tight">{event.title}</h4>
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
    </main>
  );
};

export default CommunityPage;

