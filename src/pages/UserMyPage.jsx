import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movies } from "../data/movies";
import MovieCard from "../components/molecules/MovieCard";
import LibraryCard from "../components/molecules/LibraryCard";

const UserMyPage = () => {
   const navigate = useNavigate();
   const [uploadedMovies, setUploadedMovies] = useState([]);
   
   const bookmarkedMovies = movies.slice(0, 4);
   
   useEffect(() => {
      // Load from localStorage and clean up invalid blob URLs
      const savedUploads = JSON.parse(localStorage.getItem("myUploads") || "[]");
      const cleaned = savedUploads.map(m => {
         const img = m.posterPreview || m.posterImage || "";
         if (img.startsWith("blob:")) {
            // Blob URLs are invalid after reload — remove them
            return { ...m, posterPreview: null, posterImage: null };
         }
         return m;
      });
      // Persist cleaned data back so blob URLs don't linger
      localStorage.setItem("myUploads", JSON.stringify(cleaned));
      setUploadedMovies(cleaned);
   }, []);

   const handleDelete = (movie) => {
      const updated = uploadedMovies.filter(m => m.id !== movie.id);
      setUploadedMovies(updated);
      localStorage.setItem("myUploads", JSON.stringify(updated));
   };

   // Combine with some static demo uploads if needed
   const staticMyUploads = movies.slice(10, 11); // Just one demo upload
   const allMyUploads = [...uploadedMovies, ...staticMyUploads];

   return (
      <main className="min-h-screen bg-[#0a0a0a] text-white">
         <div className="py-20 px-8">
            <div className="max-w-6xl mx-auto space-y-16">
            {/* User Header */}
            <header className="flex items-center gap-10">
               <div className="w-32 h-32 rounded-full border-2 border-amber-500/50 p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black">SY</div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-1">
                     <h1 className="text-4xl font-black tracking-tighter">신연호 <span className="text-zinc-500 text-lg font-bold ml-2">@yeonho_shin</span></h1>
                     <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Premium Movie Enthusiast • Member since 2024</p>
                  </div>
                  <div className="flex gap-8">
                     <StatItem label="Saved" value="12" />
                     <StatItem label="Feedbacks" value="45" />
                     <StatItem label="Bookmarks" value="128" />
                  </div>
               </div>
               <div className="ml-auto">
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black hover:bg-white/10 transition uppercase tracking-widest">Edit Profile</button>
               </div>
            </header>

            {/* Tabs / Sections */}
            <div className="space-y-20">
               {/* My Uploads (Prioritized section) */}
               <section className="space-y-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">🎬</span> My Uploads
                     </h2>
                     <Link to="/upload" className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition">+ New Project</Link>
                  </div>
                  <div className="space-y-6">
                     {allMyUploads.length > 0 ? (
                        allMyUploads.map(movie => (
                           <LibraryCard 
                              key={movie.id} 
                              movie={movie} 
                              onClick={(m) => navigate(`/movies/${m.id}/dashboard`)} 
                              onDelete={movie.isUserUpload ? handleDelete : undefined}
                           />
                        ))
                     ) : (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                           <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm mb-4">No projects uploaded yet</p>
                           <Link to="/upload" className="px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl text-xs">Start Your First Project</Link>
                        </div>
                     )}
                  </div>
               </section>

               {/* Bookmarks Section */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">🔖</span> My Bookmarks
                     </h2>
                     <button className="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                     {bookmarkedMovies.map(movie => (
                        <div
                          key={movie.id}
                          onClick={() => navigate(`/movies/${movie.id}`)}
                          className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer group border border-white/5 hover:border-white/15 transition-colors"
                        >
                          <img
                            src={movie.posterImage || movie.stillImage}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { if (movie.stillImage) e.target.src = movie.stillImage; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                            <p className="text-[8px] font-black tracking-[0.25em] text-amber-500/80 uppercase">{movie.awardText || "SELECTION"}</p>
                            <div>
                              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{movie.posterCredit}</p>
                              <h3 className="text-base font-black tracking-tight text-white uppercase leading-tight">{movie.posterTitle || movie.title}</h3>
                            </div>
                          </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Feedback History */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">✍️</span> Recent Activity
                     </h2>
                  </div>
                  <div className="space-y-4">
                     <ActivityItem
                        title="'회색 도시'에 피드백을 남겼습니다"
                        time="2 hours ago"
                        desc="전체적인 분위기가 정말 압도적이에요. 특히 조명 연출이 대단합니다!"
                     />
                     <ActivityItem
                        title="'꿈의 기록'을 컬렉션에 저장했습니다"
                        time="1 day ago"
                        desc="나중에 다시 보고 싶은 실험적인 작품"
                     />
                  </div>
               </section>
            </div>
          </div>
         </div>
      </main>
   );
};

const StatItem = ({ label, value }) => (
   <div>
      <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black">{value}</span>
   </div>
);

const ActivityItem = ({ title, time, desc }) => (
   <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/10 transition">
      <div className="space-y-1">
         <h3 className="text-sm font-black text-white group-hover:text-amber-500 transition-colors">{title}</h3>
         <p className="text-xs text-zinc-500 font-medium">{desc}</p>
      </div>
      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{time}</span>
   </div>
);

export default UserMyPage;
