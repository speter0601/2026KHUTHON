import React from 'react';

/**
 * LibraryCard Component
 * Horizontal card layout for uploaded projects in My Library.
 * Features a poster wrapper and project metadata.
 */
const LibraryCard = ({ movie, onClick }) => {
  return (
    <div 
      className="library-card group"
      onClick={() => onClick && onClick(movie)}
    >
      <div className="poster-wrapper">
        <img 
          src={movie.posterPreview || movie.posterImage} 
          alt={movie.title} 
        />
      </div>
      
      <div className="flex flex-col justify-center py-6 pr-8 space-y-4">
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

        <div className="pt-2">
          <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
            {movie.synopsis || movie.description || '작품 설명이 없습니다.'}
          </p>
        </div>
      </div>

      <style jsx>{`
        .library-card {
          display: flex;
          align-items: stretch;
          gap: 32px;
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
          margin: 12px;
        }

        .poster-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          border-radius: inherit;
          transform: none;
          transition: none;
        }

        .library-card:hover .poster-wrapper img {
          transform: none;
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
