import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";

const CreatorDashboardPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    synopsis: "",
    directorIntent: "",
    directorComment: "" // Message
  });
  const [activeTab, setActiveTab] = useState("main"); // 'main' or 'trailer'

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === parseInt(movieId));
    if (foundMovie) {
      setMovie(foundMovie);
      setFormData({
        title: foundMovie.title || "",
        tags: foundMovie.tags ? foundMovie.tags.join(", ") : "",
        synopsis: foundMovie.synopsis || "",
        directorIntent: foundMovie.directorIntent || "",
        directorComment: foundMovie.directorComment || ""
      });
    }
  }, [movieId]);

  if (!movie) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;
  }

  const handleSave = (e) => {
    e.preventDefault();
    // Here we would typically save to backend
    alert("영화 정보가 성공적으로 수정되었습니다.");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-12 px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <form onSubmit={handleSave} className="space-y-12">
          {/* Header & Save Button */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <h1 className="text-3xl font-black tracking-tighter">감독 영화 수정</h1>
            <button type="submit" className="px-6 py-3 bg-amber-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition transform active:scale-95">
              변경사항 저장
            </button>
          </div>

          {/* Top Section: Poster & Video Preview */}
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
            {/* Poster */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10">
                <img src={movie.posterImage} alt="Poster" className="w-full h-full object-cover" />
              </div>
              <button type="button" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition">
                포스터 변경
              </button>
            </div>

            {/* Video Area */}
            <div className="space-y-4 flex flex-col">
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setActiveTab("main")}
                  className={`px-6 py-2 text-sm font-bold rounded-t-xl transition ${activeTab === 'main' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800/50'}`}
                >
                  본편
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab("trailer")}
                  className={`px-6 py-2 text-sm font-bold rounded-t-xl transition ${activeTab === 'trailer' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800/50'}`}
                >
                  예고편
                </button>
              </div>
              <div className="flex-1 bg-zinc-800 rounded-b-xl rounded-tr-xl flex flex-col items-center justify-center min-h-[400px] border border-zinc-700 relative">
                <span className="text-zinc-500 font-bold mb-4">{activeTab === 'main' ? '본편 / 영상' : '예고편 / 클립'}</span>
                <button type="button" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition">
                  새 영상 업로드
                </button>
              </div>
            </div>
          </div>

          {/* Title & Tags */}
          <div className="space-y-4 border-b border-white/5 pb-8">
            <div className="grid gap-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">영화 이름</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-transparent text-3xl font-black outline-none border-b border-transparent focus:border-amber-500/50 pb-2 transition-colors"
                placeholder="영화 이름 가나다라마바사"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">태그 (쉼표로 구분)</label>
              <input 
                type="text" 
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full bg-transparent text-sm font-bold text-amber-500 outline-none border-b border-transparent focus:border-amber-500/50 pb-2 transition-colors"
                placeholder="#호러, #액션"
              />
            </div>
          </div>

          {/* Texts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 p-8 rounded-2xl space-y-6 border border-white/5">
              <div className="space-y-2">
                <label className="text-lg font-black tracking-tight">시놉시스</label>
                <textarea 
                  value={formData.synopsis}
                  onChange={(e) => setFormData({...formData, synopsis: e.target.value})}
                  className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-sm font-medium leading-relaxed outline-none focus:border-amber-500/50 min-h-[120px] resize-y"
                />
              </div>
              <div className="space-y-2">
                <label className="text-lg font-black tracking-tight">연출의도</label>
                <textarea 
                  value={formData.directorIntent}
                  onChange={(e) => setFormData({...formData, directorIntent: e.target.value})}
                  className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-sm font-medium leading-relaxed outline-none focus:border-amber-500/50 min-h-[100px] resize-y"
                />
              </div>
            </div>
            <div className="bg-zinc-900 p-8 rounded-2xl space-y-2 border border-white/5">
               <label className="text-lg font-black tracking-tight">감독의 한 마디 (Message)</label>
               <textarea 
                  value={formData.directorComment}
                  onChange={(e) => setFormData({...formData, directorComment: e.target.value})}
                  className="w-full bg-black/30 border border-white/5 rounded-xl p-4 text-sm font-medium leading-relaxed outline-none focus:border-amber-500/50 min-h-[200px] resize-y"
                  placeholder="무환경, 사회문제를 비롯한 다양한 영화의 경우..."
               />
            </div>
          </div>
        </form>

        {/* Dashboard Section */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <h2 className="text-2xl font-black tracking-tighter">대시보드 통계</h2>
          
          {/* Stats Panel */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
             <div className="grid grid-cols-3 border-b border-white/5">
                <div className="p-6 text-center border-r border-white/5 hover:bg-white/5 transition">
                   <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">조회수</span>
                   <span className="text-2xl font-black">106</span>
                </div>
                <div className="p-6 text-center border-r border-white/5 hover:bg-white/5 transition">
                   <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">시청 시간 (단위: 시간)</span>
                   <span className="text-2xl font-black">0.6</span>
                </div>
                <div className="p-6 text-center hover:bg-white/5 transition">
                   <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">구독자</span>
                   <span className="text-2xl font-black">-</span>
                </div>
             </div>
             <div className="p-8 h-[250px] flex items-end relative">
                {/* Mockup Line Chart */}
                <div className="absolute left-6 top-6 bottom-8 right-6 border-b border-l border-zinc-700">
                   <div className="absolute bottom-0 left-0 right-0 h-full w-full flex items-end">
                      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-[60%] stroke-cyan-400 stroke-2 fill-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                         <path d="M 0 80 Q 5 60 10 50 T 20 45 T 40 40 T 60 38 T 80 35 T 100 30" />
                      </svg>
                   </div>
                </div>
             </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-zinc-200 text-black p-8 rounded-2xl space-y-6">
             <h3 className="text-xl font-black tracking-tight">받은 피드백</h3>
             <div className="space-y-6">
                <div className="space-y-1">
                   <p className="text-sm font-bold">12:34 &lt;김강민&gt;님의 피드백 :</p>
                   <p className="text-sm">중요한 순간처럼 보이지만 긴장감이 충분히 쌓이지 않아 인상이 흐릿하다. 장면 자체의 분위기는 괜찮지만 영화 전체에서 큰 의미로 남지는 않는다.</p>
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold">31:27 &lt;신연호&gt;님의 피드백 :</p>
                   <p className="text-sm">이 장면은 굳이 필요했는지 의문이 든다. 분위기, 대사, 연출 모두 힘이 약해서 관객에게 아무런 인상을 남기지 못한다.</p>
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold">53:24 &lt;김규현&gt;님의 피드백 :</p>
                   <p className="text-sm">인물의 표정 하나만으로 상황의 무게가 전해진다. 과하지 않아서 오히려 더 현실적으로 느껴지는 장면이다.</p>
                </div>
             </div>
             
             <div className="mt-8 pt-8 border-t border-black/10 space-y-3">
                <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
                   <span>✨</span> AI 요약
                </h4>
                <p className="text-sm leading-relaxed">
                   시각적 분위기와 인물의 현실적인 표현은 강점으로 평가되었지만, 
                   일부 장면은 긴장감과 서사적 의미가 부족해 인상이 약하다는 피드백이 있었다.
                   장면의 미장센은 유지하되, 각 장면이 전체 이야기에서 수행하는 역할을 더 분명히 만들 필요가 있다.
                </p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreatorDashboardPage;
