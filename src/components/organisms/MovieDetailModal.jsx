import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * MovieDetailModal Component
 * A cinematic modal that displays detailed movie information.
 * Features a dark theme with amber accents and smooth transitions.
 */
const MovieDetailModal = ({ movie, onClose }) => {
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      {/* Dimmed Overlay - Lightened to bg-black/50 for floating feel */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" 
        onClick={onClose}
      />

      {/* Modal Container - Optimized for floating popup feel */}
      <div className="relative w-full md:w-[75vw] max-w-5xl max-h-[82vh] bg-zinc-950 border border-white/15 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.05)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Close Button - More integrated look */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          <span className="text-xl font-light">✕</span>
        </button>

        {/* Left: Cinematic Poster */}
        <div className="hidden lg:block w-[360px] shrink-0 relative group">
          <img 
            src={movie?.posterImage || movie?.stillImage} 
            alt={movie?.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-950" />
          
          {/* Poster Overlay Text (Subtle) */}
          <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
             <div className="space-y-1">
                <p className="text-[10px] font-black tracking-[0.3em] text-amber-500/60 uppercase">{movie?.awardText}</p>
             </div>
             <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter text-white leading-none uppercase drop-shadow-2xl">
                   {movie?.posterTitle}
                </h2>
                <p className="text-[11px] font-bold text-zinc-400 tracking-widest">{movie?.posterCredit}</p>
             </div>
          </div>
        </div>

        {/* Right: Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-zinc-950">
          
          {/* Top Visual: Still Image */}
          <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden group cursor-pointer bg-zinc-900" onClick={() => navigate(`/movies/${movie?.id}/watch`)}>
             <img 
               src={movie?.stillImage || movie?.posterImage} 
               alt="Still cut" 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
             
             {/* Play Button Overlay */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white text-3xl pl-1.5 shadow-2xl transition-all group-hover:scale-110 group-hover:bg-white/20">
                   ▶
                </div>
             </div>
          </div>

          {/* Info Section */}
          <div className="p-8 lg:p-12 space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black tracking-widest rounded-sm uppercase">{movie?.genres?.[0] || 'Genre'}</span>
                    <span className="text-[11px] font-black text-zinc-500 tracking-[0.2em] uppercase">{movie?.releaseDate}</span>
                  </div>
                  <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-xl">{movie?.title}</h1>
                  <div className="flex items-center gap-4 text-zinc-400 font-bold text-[13px] uppercase tracking-widest">
                    <span>{movie?.director} 감독</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span>{movie?.team}</span>
                    <span className="flex items-center gap-1 text-amber-500 ml-2">
                       ★ <span className="text-white">{movie?.rating}</span>
                    </span>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => navigate(`/movies/${movie?.id}/watch`)}
                    className="px-8 py-4 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] active:scale-95"
                  >
                    지금 시청하기
                  </button>
                  <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition active:scale-95">
                    🔖
                  </button>
               </div>
            </div>

            {/* Synopsis & Intention */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5 pb-3">Synopsis</h3>
                  <p className="text-[15px] text-zinc-400 leading-relaxed font-medium">
                     {movie?.synopsis}
                  </p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5 pb-3">Intention</h3>
                  <p className="text-[15px] text-zinc-400 leading-relaxed font-medium italic">
                     "{movie?.directorIntent}"
                  </p>
               </div>
            </div>

            {/* Message */}
            <div className="space-y-4 pt-4 border-t border-white/5">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Message</h3>
               <p className="text-[16px] text-stone-300 leading-relaxed font-medium italic">
                  "{movie?.directorMessage || movie?.directorComment || "이 작품을 보는 관객 각자가 자신의 장면을 발견하길 바랍니다."}"
               </p>
               <p className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em]">
                  — {movie?.director} 감독
               </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
               <button 
                 onClick={() => navigate(`/movies/${movie?.id}/feedback`)}
                 className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition uppercase tracking-widest"
               >
                 View Feedback
               </button>
               <button 
                 onClick={() => navigate(`/movies/${movie?.id}`)}
                 className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition uppercase tracking-widest"
               >
                 View Full Details
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
