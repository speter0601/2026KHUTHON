import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const NOTIFICATIONS = [
  { id:1, type:"feedback", icon:"💬", title:"'파도를 따라서'에 새 피드백", desc:"김민지님이 타임스탬프 02:34에 코멘트를 남겼습니다.", time:"2분 전", unread:true },
  { id:2, type:"award", icon:"🏆", title:"우수 창작자 선정 축하드립니다!", desc:"2026년 상반기 MOV:ON 우수 창작자로 선정되었습니다.", time:"1시간 전", unread:true },
  { id:3, type:"like", icon:"🤍", title:"'파도를 따라서' 좋아요 450개 달성", desc:"작품이 많은 관객들에게 사랑받고 있어요.", time:"3시간 전", unread:true },
  { id:4, type:"community", icon:"📢", title:"커뮤니티 댓글 알림", desc:"이준혁님이 회원님의 게시물에 답글을 달았습니다.", time:"어제", unread:false },
  { id:5, type:"system", icon:"🔔", title:"MOV:ON 앱 v2.3 업데이트", desc:"새로운 타임스탬프 피드백 기능이 출시되었습니다.", time:"3일 전", unread:false },
  { id:6, type:"event", icon:"🎬", title:"숏필름 페스티벌 신청 마감 임박", desc:"참가 신청 마감까지 D-3입니다.", time:"4일 전", unread:false },
];

/**
 * Global Header Component for MOV:ON
 * Provides consistent navigation across all main pages.
 * Navigation Order: Explore - My Library - Community
 */
const Header = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <header className="sticky top-0 z-[60] flex items-center justify-between px-8 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-3xl text-white font-black tracking-tighter hover:scale-105 transition active:scale-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          MOV<span className="text-amber-500">:</span>ON
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `transition-all duration-300 relative py-1 ${
                isActive 
                ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Explore
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/mypage" 
            className={({ isActive }) => 
              `transition-all duration-300 relative py-1 ${
                isActive 
                ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                My Library
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </>
            )}
          </NavLink>

          <NavLink 
            to="/community" 
            className={({ isActive }) => 
              `transition-all duration-300 relative py-1 ${
                isActive 
                ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                Community
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </>
            )}
          </NavLink>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="flex flex-1 max-w-lg mx-12 items-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-400 focus-within:bg-white/10 focus-within:border-amber-500/30 transition-all shadow-inner group">
        <span className="text-lg mr-3 opacity-40 group-focus-within:opacity-100 group-focus-within:text-amber-500 transition-all">⌕</span>
        <input
          className="w-full bg-transparent outline-none placeholder:text-zinc-600 text-white font-medium"
          placeholder="독립영화, 감독, 제작팀 검색..."
        />
        <div className="flex items-center gap-2 ml-3">
          <span className="text-[9px] font-black px-2 py-1 rounded bg-zinc-800 text-zinc-500 border border-white/5">⌘K</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          to="/upload" 
          className="hidden md:flex items-center gap-2 rounded-full bg-amber-500 text-black px-6 py-2.5 text-[12px] font-black shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] transition hover:bg-amber-400 active:scale-95"
        >
          + UPLOAD
        </Link>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(prev => !prev)}
              className="relative p-2 text-zinc-500 hover:text-white transition group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform block">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] rounded-full bg-red-500 border-2 border-[#0a0a0a] flex items-center justify-center text-[8px] font-black text-white px-0.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-[360px] bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[200]">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <div>
                    <span className="text-sm font-black text-white">알림</span>
                    {unreadCount > 0 && (
                      <span className="ml-2 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">{unreadCount}개 미읽음</span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] font-black text-zinc-500 hover:text-amber-500 transition uppercase tracking-widest">
                      모두 읽음
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-5 py-4 border-b border-white/5 cursor-pointer transition-colors ${n.unread ? "bg-amber-500/5 hover:bg-amber-500/10" : "hover:bg-white/5"}`}
                      onClick={() => setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item))}
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className={`text-[12px] font-black truncate ${n.unread ? "text-white" : "text-zinc-400"}`}>{n.title}</p>
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">{n.desc}</p>
                        <p className="text-[9px] font-black text-zinc-700 mt-1 uppercase tracking-widest">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 text-center">
                  <button className="text-[10px] font-black text-zinc-600 hover:text-white transition uppercase tracking-widest">
                    모든 알림 보기
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link to="/mypage" className="h-10 w-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-amber-400 to-orange-600 p-[1px] hover:scale-105 transition-transform shadow-lg overflow-hidden">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-[11px] font-black">SY</div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
