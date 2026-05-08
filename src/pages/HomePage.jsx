import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { movies } from "../data/movies";
import MovieCard from "../components/molecules/MovieCard";
import MovieDetailModal from "../components/organisms/MovieDetailModal";
import EventHeroCarousel from "../components/organisms/EventHeroCarousel";

const categories = ["전체", "드라마", "로맨스", "다큐", "실험영화", "청춘", "새로운 발견", "높은 평점"];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filteredMovies = useMemo(() => {
    let result = movies;
    if (activeCategory === "높은 평점") {
      result = [...movies].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (activeCategory === "새로운 발견") {
      result = movies.filter(m => m.tags.includes("신작") || m.id > 15 || m.releaseDate.startsWith("2026"));
    } else if (activeCategory !== "전체") {
      result = movies.filter(movie => movie.genres.includes(activeCategory));
    }
    return result;
  }, [activeCategory]);

  // Group movies into rows for smooth horizontal expansion behavior
  // This ensures neighboring cards push each other naturally within the same flex container.
  const movieRows = useMemo(() => {
    const rows = [];
    const itemsPerRow = 5; 
    for (let i = 0; i < filteredMovies.length; i += itemsPerRow) {
      rows.push(filteredMovies.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [filteredMovies]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500 selection:text-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative">
        
        {/* Main Hero Block: Restored Event Carousel */}
        <EventHeroCarousel onMovieClick={setSelectedMovie} />

        <div className="max-w-7xl mx-auto px-8 mt-24 space-y-16">
          {/* Category Filter Row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-8">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all duration-300 border ${
                      isActive
                        ? "bg-amber-500 text-black border-amber-500 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)]"
                        : "text-zinc-500 border-white/5 hover:border-white/20 hover:text-white bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="hidden lg:flex items-center gap-3 text-zinc-500 font-bold text-[11px] uppercase tracking-[0.4em]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Cinematic Discovery</span>
            </div>
          </div>

          {/* Movie Section: Grouped into rows for stable expansion */}
          <div className="space-y-16 pb-40">
            {movieRows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className="flex flex-col md:flex-row md:flex-nowrap gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700"
                style={{ animationDelay: `${rowIndex * 100}ms` }}
              >
                {row.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    onClick={setSelectedMovie}
                  />
                ))}
                {/* Visual Spacers to keep row width consistent even with fewer items */}
                {row.length < 5 && Array(5 - row.length).fill(0).map((_, i) => (
                   <div 
                     key={`spacer-${i}`} 
                     className="flex-1 min-w-[200px] pointer-events-none transition-[flex-grow,flex-basis,transform] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
                   />
                ))}
              </div>
            ))}
            
            {filteredMovies.length === 0 && (
              <div className="py-40 flex flex-col items-center text-center space-y-6">
                 <div className="text-6xl opacity-10 grayscale">🎬</div>
                 <div className="space-y-2">
                    <p className="text-zinc-300 font-black tracking-widest uppercase text-sm">해당하는 작품을 찾을 수 없습니다.</p>
                    <p className="text-zinc-600 font-bold text-xs">다른 카테고리를 선택하거나 검색어를 변경해 보세요.</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Movie Detail Modal Overlay */}
      {selectedMovie && (
        <MovieDetailModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {/* Decorative Brand Text */}
      <div className="fixed bottom-12 left-12 text-[12vw] font-black text-white/[0.03] pointer-events-none select-none leading-none tracking-tighter mix-blend-overlay">
        MOV:ON
      </div>
    </main>
  );
}