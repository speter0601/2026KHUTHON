import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movies } from "../data/movies";
import MovieCard from "../components/molecules/MovieCard";

const UserMyPage = () => {
   const navigate = useNavigate();
   const [uploadedMovie, setUploadedMovie] = useState(null);
   const bookmarkedMovies = movies.slice(0, 3);
   const myUploads = movies.slice(10, 12);

   useEffect(() => {
      const saved = localStorage.getItem("movon_uploaded_movie");
      if (saved) {
         setUploadedMovie(JSON.parse(saved));
      }
   }, []);

   return (
      <main className="min-h-screen bg-[#0a0a0a] text-white py-20 px-8">
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
               {/* Bookmarks Section */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">🔖</span> My Bookmarks
                     </h2>
                     <button className="text-xs font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">View All</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                     {bookmarkedMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onClick={(m) => navigate(`/movies/${m.id}`)} />
                     ))}
                  </div>
               </section>

               {/* My Uploads (For Creator-User hybrid) */}
               <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="text-amber-500">🎬</span> 내가 업로드한 영화
                     </h2>
                     <Link to="/upload" className="text-xs font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition">+ New Project</Link>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                     {uploadedMovie && (
                        <div className="bg-zinc-900/50 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row group hover:border-amber-500/30 transition-all duration-500">
                           <div className="w-full md:w-64 aspect-[3/4] overflow-hidden shrink-0">
                              <img src={uploadedMovie.posterImage} alt={uploadedMovie.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                           </div>
                           <div className="p-10 flex-1 flex flex-col justify-between">
                              <div className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{uploadedMovie.status}</span>
                                       <h3 className="text-3xl font-black tracking-tighter uppercase">{uploadedMovie.title}</h3>
                                    </div>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                       {uploadedMovie.createdAt} 등록
                                    </span>
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                    {uploadedMovie.tags.map(tag => (
                                       <span key={tag} className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded border border-amber-500/20">{tag}</span>
                                    ))}
                                 </div>
                                 <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/5">
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">조회수</span>
                                       <p className="text-xl font-black">{uploadedMovie.views}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">피드백</span>
                                       <p className="text-xl font-black">{uploadedMovie.feedbackCount}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">저장 수</span>
                                       <p className="text-xl font-black">{uploadedMovie.saves}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-4 mt-10">
                                 <button 
                                    onClick={() => navigate(`/movies/1/dashboard`)} // Redirecting to existing dashboard demo
                                    className="flex-1 py-4 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition transform active:scale-95 shadow-lg shadow-amber-500/20"
                                 >
                                    반응 보기
                                 </button>
                                 <button 
                                    onClick={() => navigate(`/movies/1/dashboard`)}
                                    className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition"
                                 >
                                    작품 관리
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {myUploads.map(movie => (
                           <MovieCard key={movie.id} movie={movie} onClick={(m) => navigate(`/movies/${m.id}/dashboard`)} />
                        ))}
                     </div>
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
