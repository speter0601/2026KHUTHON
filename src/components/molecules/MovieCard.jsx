import { useState } from "react";

/**
 * MovieCard with Soft Transitions & External Depth
 * Refines the shadow for a floating effect and eliminates harsh lines in the preview panel.
 * Keeps the poster image clear and visible, focusing on external depth rather than internal darkening.
 */
const MovieCard = ({ movie, onClick, disableHover = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 1. Hard Fallback Content
  const title = movie?.title || movie?.posterTitle || "Untitled Film";
  const director = movie?.director || "Unknown Director";
  const description = movie?.description || movie?.synopsis || "MOV:ON에서 소개하는 독립영화 작품입니다. 감독의 독창적인 시선과 감각적인 영상미를 확인해보세요.";
  const rating = movie?.rating || "4.5";
  const tags = movie?.tags?.length
    ? movie.tags.slice(0, 3)
    : (movie?.genres?.slice(0, 3) || ["독립영화", "예술", "감성"]);

  // 2. Safe Preview Image
  const previewImage = movie?.videoThumbnail || movie?.stillImage || movie?.posterImage;
  const posterImage = movie?.posterImage || movie?.stillImage || movie?.posterPreview;

  // Styles based on posterTone
  const toneStyles = {
    melancholy: "from-blue-900/40 via-transparent to-black/80",
    noir: "from-zinc-900/60 via-transparent to-black/95 grayscale-[0.3]",
    warm: "from-orange-900/30 via-transparent to-black/80",
    youth: "from-emerald-900/20 via-transparent to-black/70",
    experimental: "from-purple-900/40 via-transparent to-black/90 contrast-125",
    minimal: "from-zinc-800/10 via-transparent to-black/60",
    blue: "from-indigo-900/40 via-transparent to-black/80",
    documentary: "from-stone-900/40 via-transparent to-black/80",
    romance: "from-pink-900/30 via-transparent to-black/80",
    thriller: "from-red-900/40 via-transparent to-black/95",
  };

  const currentTone = toneStyles[movie?.posterTone] || toneStyles.minimal;

  const handleMouseEnter = () => {
    if (!disableHover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disableHover) setIsHovered(false);
  };

  return (
    <article
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick && onClick(movie)}
      className={`relative h-[320px] transition-[flex-grow,flex-basis,width,transform,box-shadow,border-color] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden rounded-xl bg-zinc-950 border border-white/10 group flex
        ${!disableHover && isHovered
          ? "md:min-w-[520px] md:flex-[2.8] border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.06)] z-30"
          : "flex-1 min-w-[200px] shadow-lg z-10"}
      `}
    >
      {/* External Cinematic Depth Layer (Floating Shadow) */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-white/5 via-transparent to-amber-500/5 transition-opacity duration-[520ms] pointer-events-none ${!disableHover && isHovered ? "opacity-100" : "opacity-0"}`} />

      {/* --- POSTER SECTION --- */}
      <div className={`relative h-full shrink-0 transition-[width] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${!disableHover && isHovered ? "md:w-[220px] w-full" : "w-full"}`}>
        <img
          src={posterImage}
          alt={title}
          className={`h-full w-full object-cover transition-all duration-1000 ${!disableHover && isHovered ? "brightness-[0.85] contrast-105" : "brightness-100"} ${movie?.posterTone === 'noir' ? 'grayscale-[0.2]' : ''}`}
        />

        {/* Cinematic Gradient Overlay (Lightened on Hover) */}
        <div className={`absolute inset-0 bg-gradient-to-t ${currentTone} transition-opacity duration-[520ms] ${!disableHover && isHovered ? "opacity-20" : "opacity-100"}`} />

        {/* Poster Internal Typography (Fixed & Clear) */}
        <div className={`absolute inset-0 p-5 flex flex-col justify-between pointer-events-none transition-all duration-[520ms] ${!disableHover && isHovered ? "opacity-100 translate-x-0" : "opacity-100 translate-x-0"}`}>
          <div className="space-y-1">
            <p className="text-[8px] font-black tracking-[0.3em] text-amber-500 uppercase">{movie?.awardText || "OFFICIAL SELECTION"}</p>
            <p className="text-[11px] font-bold text-zinc-300 leading-tight italic line-clamp-2">{movie?.tagline}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black tracking-widest text-zinc-400 uppercase">{movie?.posterCredit}</p>
            <h3 className="text-xl font-black tracking-tighter text-white uppercase leading-tight drop-shadow-lg">{movie?.posterTitle || title}</h3>
          </div>
        </div>
      </div>

      {/* --- PREVIEW PANEL (RIGHT SIDE) --- */}
      <div className={`relative flex-1 h-full overflow-hidden transition-[opacity,transform] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col bg-zinc-950 border-l border-white/10 hidden md:flex z-20
        ${!disableHover && isHovered ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-1 pointer-events-none"}
      `}>
        {/* 1. Preview Visual Area (Gradient Transition) */}
        <div className="relative h-36 w-full shrink-0 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0 z-0">
            {!imageError && previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover opacity-70 transition-transform duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex flex-col items-center justify-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-30 text-[10px] text-white">▶</div>
                <span className="text-[8px] font-black text-zinc-600 tracking-[0.3em] uppercase">MOV:ON PREVIEW</span>
              </div>
            )}

            {/* Soft Integration Gradient (Replaces Hard Line) */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          </div>

          {/* Centered Minimal Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/40 text-xs transition-colors duration-[520ms] group-hover:text-amber-500 group-hover:border-amber-500/30">
              ▶
            </div>
          </div>
        </div>

        {/* 2. Preview Metadata Content Layer (Optimized Layout) */}
        <div className={`relative z-30 -mt-12 p-6 flex-1 flex flex-col justify-between transition-[opacity,transform] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${!disableHover && isHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}
        `}>
          {/* Subtle Glass Backdrop Blur for Integration */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/90 to-zinc-950 backdrop-blur-[3px] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-lg font-black tracking-tight text-white uppercase truncate leading-none">{title}</h4>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span className="text-amber-400">{director} 감독</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <div className="flex items-center gap-1 text-amber-500">
                  ★ <span className="text-zinc-300">{rating}</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] font-medium text-zinc-400 leading-relaxed line-clamp-2">
              {description}
            </p>

            {/* Tags Area */}
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-[8px] font-black text-zinc-500 border border-white/5 bg-white/[0.03] px-2 py-1 rounded uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Area - Cleanly Aligned at Bottom */}
          <div className="relative z-10 flex items-center gap-3 pt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onClick(movie); }}
              className="flex-[2] h-11 bg-amber-500 text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-400 transition active:scale-95 shadow-lg shadow-amber-500/20"
            >
              Watch Now
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClick(movie); }}
              className="flex-1 h-11 bg-white/5 border border-white/10 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition active:scale-95"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
