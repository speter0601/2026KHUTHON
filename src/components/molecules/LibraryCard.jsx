import React from 'react';

/**
 * LibraryCard Component
 * Horizontal card layout for uploaded projects in My Library.
 */
const LibraryCard = ({ movie, onClick, onDelete }) => {
  return (
    <div
      className="library-card group"
      onClick={() => onClick && onClick(movie)}
    >
      {/* Poster */}
      <div className="poster-wrapper">
        <img
          src={movie.posterPreview || movie.posterImage}
          alt={movie.title}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80"; }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-center py-6 space-y-4 flex-1 min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">
              {movie.createdAt || '2026. 05. 09'}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {movie.tags?.join(', ') || movie.genres?.join(', ')}
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tighter text-white group-hover:text-amber-500 transition-colors">
            {movie.title || 'UNTITLED FILM'}
          </h3>
        </div>

        <div className="flex gap-6">
          <StatMini label="Views" value={movie.views || 0} />
          <StatMini label="Feedback" value={movie.feedback || 0} />
          <StatMini label="Saves" value={movie.saves || 0} />
        </div>

        <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
          {movie.synopsis || movie.description || '작품 설명이 없습니다.'}
        </p>
      </div>

      {/* Delete action — right edge, hover only */}
      {onDelete && (
        <div
          className="flex items-center justify-center w-20 shrink-0 border-l border-white/5 opacity-0 group-hover:opacity-100 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(movie); }}
            className="flex flex-col items-center gap-2 text-zinc-600 hover:text-red-400 transition-colors"
          >
            <span className="w-10 h-10 rounded-2xl border border-white/8 bg-white/3 hover:border-red-500/40 hover:bg-red-500/10 flex items-center justify-center transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </span>
            <span className="text-[8px] font-black uppercase tracking-widest">삭제</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .library-card {
          display: flex;
          align-items: stretch;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          background: rgba(18, 18, 20, 0.95);
          cursor: pointer;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
          width: 100%;
        }

        .library-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 159, 0, 0.35);
          background: rgba(24, 24, 26, 0.98);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.35),
            0 0 28px rgba(255, 159, 0, 0.12);
        }

        .poster-wrapper {
          width: 200px;
          height: 280px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 22px;
          background: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 12px 24px 12px 12px;
        }

        .poster-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: inherit;
        }
      `}</style>
    </div>
  );
};

const StatMini = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">{label}</span>
    <span className="text-sm font-black text-zinc-300">{value}</span>
  </div>
);

export default LibraryCard;
