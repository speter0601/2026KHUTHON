import Title from '../atoms/Title';
import Subtitle from '../atoms/Subtitle';

const MovieInfoSection = ({ movie }) => {
  return (
    <section className="px-8 py-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Info */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 border-b border-white/5 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 font-bold tracking-widest text-[11px] uppercase">Independent Selection</span>
              <div className="h-[1px] w-8 bg-amber-500/30" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-6xl font-black tracking-tighter text-white">
                {movie.title}
              </h1>
              <div className="flex items-center gap-4 text-zinc-500 font-bold text-[13px] uppercase tracking-widest">
                <span>{movie.director} 감독</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>{movie.team}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span>{movie.releaseDate}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-zinc-400 tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="flex items-center gap-1 text-2xl font-black text-white">
                  <span className="text-amber-500 text-3xl">★</span> {movie.rating}
                </div>
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  {movie.ratingCount} Ratings
                </div>
              </div>
              <button className="px-10 py-5 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)] active:scale-95">
                보러가기
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
             {/* Synopsis */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500/80 text-xl">📜</span>
                  <Title level={3} className="text-white text-xl uppercase tracking-widest">Synopsis</Title>
                </div>
                <p className="text-lg text-zinc-400 leading-relaxed font-medium max-w-3xl">
                  {movie.synopsis}
                </p>
             </div>

             {/* Intention */}
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500/80 text-xl">🎬</span>
                  <Title level={3} className="text-white text-xl uppercase tracking-widest">Intention</Title>
                </div>
                <p className="text-lg text-zinc-400 leading-relaxed font-medium max-w-3xl italic">
                  "{movie.directorIntent}"
                </p>
             </div>
          </div>

          <div className="space-y-8">
             {/* Message */}
             <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 text-8xl text-white/5 font-serif select-none group-hover:text-amber-500/5 transition-colors">"</div>
                <Title level={3} className="text-white text-sm uppercase tracking-widest border-b border-white/5 pb-4">Message</Title>
                <p className="text-base text-zinc-400 leading-relaxed italic font-medium">
                  "{movie.directorMessage || movie.directorComment || "이 작품을 보는 관객 각자가 자신의 장면을 발견하길 바랍니다."}"
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-amber-500/60 uppercase tracking-widest">— {movie.director} 감독</span>
                </div>
             </div>

             {/* Share / Action */}
             <div className="flex gap-3">
               <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-bold text-zinc-400 hover:bg-white/10 transition">공유하기</button>
               <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-bold text-zinc-400 hover:bg-white/10 transition">컬렉션 저장</button>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MovieInfoSection;
