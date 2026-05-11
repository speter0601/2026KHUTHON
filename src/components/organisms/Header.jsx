import { Link, NavLink } from "react-router-dom";

/**
 * Global Header Component for MOV:ON
 * Provides consistent navigation across all main pages.
 * Navigation Order: Explore - My Library - Community
 */
const Header = () => {
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
          <button className="relative p-2 text-zinc-500 hover:text-white transition group">
            <span className="text-xl group-hover:scale-110 transition-transform block">🔔</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600 border-2 border-[#0a0a0a]" />
          </button>
          <Link to="/mypage" className="h-10 w-10 rounded-full border-2 border-white/10 bg-gradient-to-br from-amber-400 to-orange-600 p-[1px] hover:scale-105 transition-transform shadow-lg overflow-hidden">
             <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center text-[11px] font-black">SY</div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
