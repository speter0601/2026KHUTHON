import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/molecules/MovieCard";
import Header from "../components/organisms/Header";

const AVAILABLE_TAGS = [
   "액션", "코미디", "드라마", "로맨스", "스릴러", "공포",
   "SF", "범죄", "전쟁", "뮤지컬", "다큐멘터리", "애니메이션"
];

const UploadPage = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      title: "",
      director: "신연호",
      genres: ["독립영화"],
      description: "",
      rating: "0.0",
      tags: [],
      synopsis: "",
      directingIntention: ""
   });

   // File & Preview States
   const [posterFile, setPosterFile] = useState(null);
   const [posterPreview, setPosterPreview] = useState(null);
   const [posterProgress, setPosterProgress] = useState(0);

   const [trailerFile, setTrailerFile] = useState(null);
   const [trailerPreview, setTrailerPreview] = useState(null);
   const [trailerProgress, setTrailerProgress] = useState(0);

   const [videoFile, setVideoFile] = useState(null);
   const [videoPreview, setVideoPreview] = useState(null);
   const [videoProgress, setVideoProgress] = useState(0);

   const [toast, setToast] = useState({ show: false, message: "" });

   const posterInputRef = useRef(null);
   const trailerInputRef = useRef(null);
   const videoInputRef = useRef(null);

   // Cleanup URLs to avoid memory leaks
   useEffect(() => {
      return () => {
         if (posterPreview) URL.revokeObjectURL(posterPreview);
         if (trailerPreview) URL.revokeObjectURL(trailerPreview);
         if (videoPreview) URL.revokeObjectURL(videoPreview);
      };
   }, [posterPreview, trailerPreview, videoPreview]);

   const simulateUpload = (type, file, callback) => {
      let progress = 0;
      const interval = setInterval(() => {
         progress += Math.random() * 30;
         if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            const url = URL.createObjectURL(file);
            callback(url);
         }

         if (type === 'poster') setPosterProgress(progress);
         else if (type === 'trailer') setTrailerProgress(progress);
         else if (type === 'video') setVideoProgress(progress);
      }, 200);
   };

   const handleFileChange = (type, e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (type === 'poster') {
         setPosterFile(file);
         setPosterProgress(1);
         simulateUpload('poster', file, (url) => setPosterPreview(url));
      } else if (type === 'trailer') {
         setTrailerFile(file);
         setTrailerProgress(1);
         simulateUpload('trailer', file, (url) => setTrailerPreview(url));
      } else if (type === 'video') {
         setVideoFile(file);
         setVideoProgress(1);
         simulateUpload('video', file, (url) => setVideoPreview(url));
      }
   };

   const showToast = (message) => {
      setToast({ show: true, message });
      setTimeout(() => setToast({ show: false, message: "" }), 2500);
   };

   const handlePublish = (e) => {
      e.preventDefault();

      // Validation bypassed for demo purposes
      // if (!formData.title || !posterPreview) {
      //    showToast("제목과 포스터는 필수입니다.");
      //    return;
      // }

      const newMovie = {
         id: Date.now(),
         title: formData.title?.trim() || "UNTITLED FILM",
         director: formData.director || "신연호",
         posterPreview: posterPreview || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
         trailerPreview: trailerPreview,
         videoPreview: videoPreview,
         posterFileName: posterFile?.name,
         trailerFileName: trailerFile?.name,
         videoFileName: videoFile?.name,
         tags: formData.tags?.length > 0 ? formData.tags : ["독립영화"],
         genres: formData.tags?.length > 0 ? formData.tags : ["독립영화"],
         synopsis: formData.synopsis?.trim() || "등록된 줄거리가 없습니다.",
         description: formData.description?.trim() || "등록된 메시지가 없습니다.",
         directingIntention: formData.directingIntention?.trim() || "등록된 제작 의도가 없습니다.",
         createdAt: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
         views: 0,
         feedback: 0,
         saves: 0,
         rating: "0.0",
         posterTone: "minimal",
         posterImage: posterPreview,
         isUserUpload: true
      };

      const existingUploads = JSON.parse(localStorage.getItem("myUploads") || "[]");
      localStorage.setItem("myUploads", JSON.stringify([newMovie, ...existingUploads]));

      showToast("작품이 라이브러리에 등록되었습니다");

      setTimeout(() => {
         navigate("/mypage");
      }, 1500);
   };

   const previewMovie = {
      id: 999,
      ...formData,
      title: formData.title || "UNTITLED FILM",
      posterImage: posterPreview || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=800&q=80",
      genres: formData.tags.length > 0 ? formData.tags : ["Genre"],
      tags: formData.tags.length > 0 ? formData.tags : ["Preview Tag"]
   };

   return (
      <main className="min-h-screen bg-[#0a0a0a] text-white relative">
         <Header />
         
         <div className="py-20 px-8">
            {/* Custom Toast */}
            {toast.show && (
               <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3">
                     <span className="text-xl">✨</span>
                     {toast.message}
                  </div>
               </div>
            )}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20">
               {/* Upload Form */}
               <div className="space-y-12">
                  <header className="space-y-2">
                     <h1 className="text-5xl font-black tracking-tighter">New Project</h1>
                     <p className="text-zinc-500 font-medium">당신의 영화를 MOV:ON 독립영화 아카이브에 등록하세요.</p>
                  </header>

                  <form className="space-y-10" onSubmit={handlePublish}>
                     {/* Basic Info */}
                     <div className="space-y-6">
                        <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Project Title</label>
                           <input
                              type="text"
                              placeholder="영화 제목을 입력하세요"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500/50 transition-all font-bold"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           />
                        </div>
                     </div>

                     {/* Asset Upload */}
                     <div className="grid grid-cols-3 gap-6">
                        {/* Poster */}
                        <UploadBox
                           label="Poster Image"
                           type="poster"
                           progress={posterProgress}
                           preview={posterPreview}
                           file={posterFile}
                           inputRef={posterInputRef}
                           accept="image/*"
                           onChange={(e) => handleFileChange('poster', e)}
                           icon="🖼️"
                        />

                        {/* Trailer */}
                        <UploadBox
                           label="Trailer File"
                           type="trailer"
                           progress={trailerProgress}
                           preview={trailerPreview}
                           file={trailerFile}
                           inputRef={trailerInputRef}
                           accept="video/*,.mov,image/*"
                           onChange={(e) => handleFileChange('trailer', e)}
                           icon="🎬"
                           isVideo
                        />

                        {/* Video */}
                        <UploadBox
                           label="Video File"
                           type="video"
                           progress={videoProgress}
                           preview={videoPreview}
                           file={videoFile}
                           inputRef={videoInputRef}
                           accept="video/*,.mov,image/*"
                           onChange={(e) => handleFileChange('video', e)}
                           icon="🎞️"
                           isVideo
                        />
                     </div>

                     {/* Tags & Details */}
                     <div className="space-y-8">
                        <div className="grid gap-3">
                           <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Genres</label>
                           <div className="flex flex-wrap gap-3">
                              {AVAILABLE_TAGS.map(tag => (
                                 <label key={tag} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.tags.includes(tag) ? 'bg-amber-500 border-amber-500' : 'bg-white/5 border-white/10 group-hover:border-white/30'}`}>
                                       {formData.tags.includes(tag) && <span className="text-black text-[10px] font-black">✓</span>}
                                    </div>
                                    <span className={`text-sm font-medium select-none transition-colors ${formData.tags.includes(tag) ? 'text-amber-500' : 'text-zinc-300'}`}>{tag}</span>
                                    <input
                                       type="checkbox"
                                       className="hidden"
                                       checked={formData.tags.includes(tag)}
                                       onChange={(e) => {
                                          const newTags = e.target.checked
                                             ? [...formData.tags, tag]
                                             : formData.tags.filter(t => t !== tag);
                                          setFormData({ ...formData, tags: newTags });
                                       }}
                                    />
                                 </label>
                              ))}
                           </div>
                        </div>
                        <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Synopsis</label>
                           <textarea
                              placeholder="영화의 줄거리를 입력하세요"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500/50 transition-all font-bold min-h-[150px] resize-none"
                              value={formData.synopsis}
                              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                           />
                        </div>
                        <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Intention</label>
                           <textarea
                              placeholder="기획 및 연출 의도를 입력하세요"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500/50 transition-all font-bold min-h-[150px] resize-none"
                              value={formData.directingIntention}
                              onChange={(e) => setFormData({ ...formData, directingIntention: e.target.value })}
                           />
                        </div>
                        <div className="grid gap-2">
                           <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Message</label>
                           <input
                              type="text"
                              placeholder="감독의 한 마디"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-amber-500/50 transition-all font-bold"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                           />
                        </div>
                     </div>

                     <button
                        type="submit"
                        className="w-full py-5 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-amber-400 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Publish Project
                     </button>
                  </form>
               </div>

               {/* Real-time Preview */}
               <div className="relative">
                  <div className="sticky top-32 space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-500">Live Preview</h3>
                        <p className="text-[12px] font-bold text-zinc-500">홈 화면에 표시될 카드 디자인을 확인하세요.</p>
                     </div>
                     <div className="max-w-[300px] mx-auto">
                        <MovieCard movie={previewMovie} disableHover />
                     </div>
                     <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Quality Check</h4>
                        <div className="space-y-2">
                           <CheckItem label="Poster" status={posterProgress === 100} />
                           <CheckItem label="Trailer" status={trailerProgress === 100} />
                           <CheckItem label="Video" status={videoProgress === 100} />
                           <CheckItem label="Title" status={formData.title.length > 0} />
                           <CheckItem label="Genre Tags" status={formData.tags.length > 0} />
                           <CheckItem label="Synopsis" status={formData.synopsis.length > 0} />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
};

const UploadBox = ({ label, progress, preview, file, inputRef, accept, onChange, icon, isVideo }) => (
   <div className="space-y-3">
      <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">{label}</label>
      <div
         className={`aspect-[3/4] rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group flex flex-col items-center justify-center gap-4 ${progress === 100 ? 'border-amber-500 bg-amber-500/5' : 'border-dashed border-white/10 bg-white/2 hover:border-white/30'
            }`}
         onClick={() => inputRef.current.click()}
      >
         {progress > 0 && progress < 100 ? (
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Uploading... {Math.round(progress)}%</span>
            </div>
         ) : progress === 100 ? (
            <>
               <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Preview" />
               {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                     <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center">
                        <span className="text-amber-500 ml-1">▶</span>
                     </div>
                  </div>
               )}
               <div className="absolute top-4 left-4 bg-amber-500 text-black text-[9px] font-black px-2 py-1 rounded-md z-20 shadow-lg animate-in zoom-in duration-300">업로드 완료</div>
               <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Upload Complete</span>
            </>
         ) : (
            <>
               <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">{icon}</span>
               <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">Select File</span>
            </>
         )}
      </div>
      <input type="file" ref={inputRef} className="hidden" accept={accept} onChange={onChange} />
      {file && <p className="text-[10px] text-zinc-500 font-bold truncate px-2">{file.name}</p>}
   </div>
);

const CheckItem = ({ label, status }) => (
   <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium text-zinc-400">{label}</span>
      <span className={status ? "text-emerald-500" : "text-zinc-600 transition-colors"}>
         {status ? "✓" : "✕"}
      </span>
   </div>
);

export default UploadPage;
