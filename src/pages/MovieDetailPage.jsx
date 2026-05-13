import { useParams, useNavigate, Link } from "react-router-dom";
import { movies } from "../data/movies";
import MovieDetailHero from "../components/organisms/MovieDetailHero";
import MovieInfoSection from "../components/organisms/MovieInfoSection";
import NotFound from "./NotFound";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  const movie = movies.find(m => m.id === parseInt(movieId));

  if (!movie) {
    return <NotFound />;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500 selection:text-black pb-24">
      {/* Background Gradient Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative">
        {/* Detail Navigation Header */}
        <header className="flex items-center justify-between px-8 py-6 bg-transparent border-b border-white/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition group"
            >
              <span className="text-xl group-hover:-translate-x-0.5 transition-transform">←</span>
            </button>
            <Link to="/" className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">
              MOV<span className="text-amber-500">:</span>ON
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-zinc-400 text-[12px] font-bold uppercase tracking-widest mr-8">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Link to="/reports" className="hover:text-white transition">Library</Link>
              <Link to="/analytics" className="hover:text-white transition">Analytics</Link>
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <button className="hidden lg:flex items-center gap-2 rounded-full bg-amber-500 text-black px-5 py-2 text-[12px] font-bold shadow-lg transition hover:bg-amber-400 active:scale-95">
                + 만들기
              </button>
              <div className="flex items-center gap-3">
                <button className="text-zinc-400 hover:text-white transition text-xl">🔔</button>
                <div className="h-9 w-9 rounded-full border border-white/20 bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl cursor-pointer" />
              </div>
            </div>
          </div>
        </header>

        {/* Cinematic Sections */}
        <MovieDetailHero movie={movie} />
        <MovieInfoSection movie={movie} />


      </div>
    </main>
  );
};

export default MovieDetailPage;
