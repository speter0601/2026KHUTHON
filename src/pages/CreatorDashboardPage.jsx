import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { movies } from "../data/movies";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
];

const AssetCard = ({ type, duration, status, date, thumbnail, fallbackIdx = 0, onPreview, onChange }) => (
  <div className="group bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-white/10 hover:bg-zinc-900 shadow-xl flex flex-col h-[400px]">
    <div className="relative h-48 bg-zinc-800 overflow-hidden shrink-0">
      <img
        src={thumbnail || FALLBACK_IMAGES[fallbackIdx % FALLBACK_IMAGES.length]}
        alt={type}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
        onError={(e) => { e.target.src = FALLBACK_IMAGES[fallbackIdx % FALLBACK_IMAGES.length]; }}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onPreview} className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center text-lg pl-0.5">▶</button>
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-[10px] font-black text-white">{duration}</div>
    </div>
    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
      <div className="space-y-1"><div className="flex justify-between"><h4 className="text-[11px] font-black text-zinc-500 uppercase">{type}</h4><span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{status}</span></div><p className="text-[10px] font-bold text-zinc-600">{date} 업로드</p></div>
      <div className="flex flex-col gap-2"><button onClick={onPreview} className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition">미리보기</button><button onClick={onChange} className="w-full py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition">영상 변경</button></div>
    </div>
  </div>
);

const MetricCard = ({ label, value, unit = "" }) => (
  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-1 group hover:border-white/10 transition-colors">
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
    <div className="flex items-baseline gap-1"><span className="text-3xl font-black text-white group-hover:text-amber-500 transition-colors">{value}</span>{unit && <span className="text-xs font-bold text-zinc-600">{unit}</span>}</div>
  </div>
);

const CHART_DATA = {
  "조회수":   [{ d:"05.03",v:42},{d:"05.04",v:85},{d:"05.05",v:124},{d:"05.06",v:98},{d:"05.07",v:156},{d:"05.08",v:132},{d:"05.09",v:184},{d:"05.10",v:210},{d:"05.11",v:175},{d:"05.12",v:230},{d:"05.13",v:195}],
  "시청 시간":[{ d:"05.03",v:0.3},{d:"05.04",v:0.7},{d:"05.05",v:1.2},{d:"05.06",v:0.9},{d:"05.07",v:1.5},{d:"05.08",v:1.1},{d:"05.09",v:1.8},{d:"05.10",v:2.1},{d:"05.11",v:1.6},{d:"05.12",v:2.4},{d:"05.13",v:1.9}],
  "피드백":   [{ d:"05.03",v:3},{d:"05.04",v:5},{d:"05.05",v:8},{d:"05.06",v:4},{d:"05.07",v:12},{d:"05.08",v:7},{d:"05.09",v:15},{d:"05.10",v:18},{d:"05.11",v:11},{d:"05.12",v:22},{d:"05.13",v:14}],
  "완주율":   [{ d:"05.03",v:55},{d:"05.04",v:62},{d:"05.05",v:70},{d:"05.06",v:58},{d:"05.07",v:74},{d:"05.08",v:67},{d:"05.09",v:80},{d:"05.10",v:83},{d:"05.11",v:76},{d:"05.12",v:88},{d:"05.13",v:72}],
};
const UNITS = { "조회수":"회", "시청 시간":"h", "피드백":"건", "완주율":"%" };

const ChartTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-amber-500/30 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-amber-500">{payload[0].value}<span className="text-xs text-zinc-400 ml-1">{unit}</span></p>
    </div>
  );
};

const ChartModule = ({ activeTab, onTabChange }) => {
  const tabs = ["조회수", "시청 시간", "피드백", "완주율"];
  const raw = CHART_DATA[activeTab] || [];
  const unit = UNITS[activeTab] || "";
  const isDecimal = activeTab === "시청 시간";
  const fmt = (v) => isDecimal ? v.toFixed(1) : Math.round(v);
  const total = raw.reduce((s, d) => s + d.v, 0);
  const peak = Math.max(...raw.map(d => d.v));
  const avg = raw.slice(-7).reduce((s, d) => s + d.v, 0) / Math.min(7, raw.length);
  const isBar = activeTab === "피드백";
  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
      <div className="flex border-b border-white/5">
        {tabs.map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? "bg-amber-500/10 text-amber-500 border-b-2 border-amber-500" : "text-zinc-600 hover:text-zinc-300"
            }`}>{tab}</button>
        ))}
      </div>
      <div className="flex items-center gap-6 px-6 pt-5 pb-1">
        <div><p className="text-[10px] font-black text-zinc-600 uppercase">총 합계</p><p className="text-2xl font-black text-white">{fmt(total)}<span className="text-xs text-zinc-500 ml-1">{unit}</span></p></div>
        <div className="h-8 w-px bg-white/5" />
        <div><p className="text-[10px] font-black text-zinc-600 uppercase">최고</p><p className="text-2xl font-black text-amber-500">{fmt(peak)}<span className="text-xs text-amber-700 ml-1">{unit}</span></p></div>
        <div className="h-8 w-px bg-white/5" />
        <div><p className="text-[10px] font-black text-zinc-600 uppercase">7일 평균</p><p className="text-2xl font-black text-white">{fmt(avg)}<span className="text-xs text-zinc-500 ml-1">{unit}</span></p></div>
      </div>
      <div className="px-4 pb-6 pt-2 h-60">
        <ResponsiveContainer width="100%" height="100%">
          {isBar ? (
            <BarChart data={raw} margin={{ top:4, right:8, left:-20, bottom:0 }}>
              <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/><stop offset="100%" stopColor="#f59e0b" stopOpacity={0.3}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="d" tick={{ fill:"#52525b", fontSize:9, fontWeight:700 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#52525b", fontSize:9, fontWeight:700 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip unit={unit}/>} cursor={{ fill:"rgba(255,255,255,0.03)" }}/>
              <Bar dataKey="v" fill="url(#bg)" radius={[6,6,0,0]}/>
            </BarChart>
          ) : (
            <AreaChart data={raw} margin={{ top:4, right:8, left:-20, bottom:0 }}>
              <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="d" tick={{ fill:"#52525b", fontSize:9, fontWeight:700 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#52525b", fontSize:9, fontWeight:700 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip unit={unit}/>}/>
              <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} fill="url(#ag)" dot={{ fill:"#f59e0b",r:3,strokeWidth:0 }} activeDot={{ r:5,fill:"#f59e0b",stroke:"#1a1a1a",strokeWidth:2 }} animationDuration={500}/>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Feedback data ──────────────────────────────────────────────
const FEEDBACKS = [
  { id:1, user:"김민지", avatar:"KM", rating:5, date:"2026.05.12", text:"영상미가 정말 압도적이에요. 조명과 색감의 조화가 독보적입니다. 마지막 장면에서 눈물이 났어요.", tags:["영상미","감동"] },
  { id:2, user:"이준혁", avatar:"LJ", rating:4, date:"2026.05.11", text:"독립영화답지 않은 완성도. 다만 중반부 전개가 약간 느리게 느껴졌습니다.", tags:["완성도","편집"] },
  { id:3, user:"박소연", avatar:"PS", rating:5, date:"2026.05.10", text:"배우들의 연기가 너무 자연스러워서 다큐멘터리 같았어요. 강력 추천합니다!", tags:["연기","추천"] },
  { id:4, user:"최도현", avatar:"CD", rating:3, date:"2026.05.09", text:"결말이 열린 결말이라 처음엔 당황했지만, 곱씹을수록 여운이 남네요.", tags:["결말","여운"] },
  { id:5, user:"윤서아", avatar:"YS", rating:5, date:"2026.05.08", text:"OST가 너무 좋아서 따로 찾아봤어요. 영상과 음악의 시너지가 완벽합니다.", tags:["음악","시너지"] },
];

const AI_SUMMARY = {
  keywords: ["조명","색감","연기","완성도","OST","여운","감동","영상미"],
  positives: ["독특한 시각적 스타일에 대한 높은 평가","배우 연기력이 일관되게 언급됨","음악과 영상의 조화가 강점"],
  improvements: ["중반부(12~18분) 구간에서 이탈률 상승","결말의 명확성에 대한 혼재된 의견"],
  avgRating: 4.4,
};

const TIMESTAMP_FEEDBACKS = [
  { id:1, user:"김민지", avatar:"KM", time:"02:34", timeMs:154, text:"이 장면 조명이 정말 환상적이에요! 색감 대비가 압도적입니다.", sentiment:"positive", rating:5 },
  { id:2, user:"이준혁", avatar:"LJ", time:"07:12", timeMs:432, text:"여기서 주인공의 표정 연기가 살짝 어색하게 느껴졌어요.", sentiment:"neutral", rating:3 },
  { id:3, user:"박소연", avatar:"PS", time:"12:45", timeMs:765, text:"배경음악이 이 장면과 너무 완벽하게 어울려요. OST 정보 알고 싶어요!", sentiment:"positive", rating:5 },
  { id:4, user:"최도현", avatar:"CD", time:"15:20", timeMs:920, text:"전개가 갑자기 빨라지는 느낌? 조금 당황스러웠습니다.", sentiment:"negative", rating:2 },
  { id:5, user:"윤서아", avatar:"YS", time:"19:08", timeMs:1148, text:"클라이맥스 직전 이 씬, 텐션이 최고조에 달하는 순간이네요.", sentiment:"positive", rating:5 },
  { id:6, user:"한지수", avatar:"HJ", time:"22:50", timeMs:1370, text:"결말을 앞두고 이 장면에서 이미 눈물이 나오기 시작했어요.", sentiment:"positive", rating:5 },
];


const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`text-sm ${i <= rating ? "text-amber-500" : "text-zinc-700"}`}>★</span>
    ))}
  </div>
);

const FeedbackFolder = ({ title, count, isActive, onClick, icon }) => (
  <button onClick={onClick} className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-3 ${isActive ? "bg-amber-500/10 border-amber-500/30" : "bg-zinc-900/40 border-white/5 hover:border-white/10"}`}>
    <div className="flex items-center justify-between"><span className="text-xl">{icon}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-amber-500 text-black" : "bg-white/5 text-zinc-500"}`}>{count}</span></div>
    <h5 className={`text-[11px] font-black uppercase ${isActive ? "text-amber-500" : "text-white"}`}>{title}</h5>
  </button>
);

const CreatorDashboardPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [formData, setFormData] = useState({ title: "", tags: "", synopsis: "", directorIntent: "", genres: [] });
  const [activeChartTab, setActiveChartTab] = useState("조회수");
  const [activeFeedbackFolder, setActiveFeedbackFolder] = useState("전체 피드백");
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReportSaving, setIsReportSaving] = useState(false);

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === parseInt(movieId)) || movies[0];
    if (foundMovie) {
      setMovie(foundMovie);
      setFormData({ title: foundMovie.title, tags: foundMovie.tags?.join(", ") || "", synopsis: foundMovie.synopsis || "", directorIntent: foundMovie.directorIntent || "", genres: foundMovie.genres || [] });
    }
  }, [movieId]);

  const showToast = (m) => { setToast({ show: true, message: m }); setTimeout(() => setToast({ show: false, message: "" }), 2500); };
  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pt-4 relative">
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-24">
        {toast.show && (<div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-amber-500 text-black px-8 py-4 rounded-2xl font-black shadow-2xl">✅ {toast.message}</div>)}
        <form onSubmit={(e) => { e.preventDefault(); showToast("저장되었습니다"); }} className="space-y-24">
          <div className="flex justify-between items-end border-b border-white/5 pb-10">
            <div className="space-y-4"><span className="text-xs font-black text-amber-500 uppercase tracking-widest">Dashboard</span><h1 className="text-5xl font-black tracking-tighter uppercase">크리에이터 대시보드</h1></div>
            <button type="submit" className="px-10 py-4 bg-amber-500 text-black font-black uppercase rounded-2xl shadow-lg">변경사항 저장</button>
          </div>
          <div className="space-y-8">
            <h3 className="text-sm font-black text-zinc-500 uppercase flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-amber-500" />미디어 에셋 관리</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 h-[400px]">
                <img src={movie.posterImage} alt="Poster" className="w-full h-full object-cover opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 space-y-4"><h3 className="text-xl font-black text-white">{formData.title}</h3><button type="button" className="w-full py-3 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase">포스터 변경</button></div>
              </div>
              <AssetCard type="본편 영상" duration="24:16" status="완료" date="2026.05.09" thumbnail={movie.videoThumbnail || movie.stillImage} fallbackIdx={0} onPreview={() => {}} onChange={() => {}} />
              <AssetCard type="예고편" duration="01:32" status="완료" date="2026.05.09" thumbnail={movie.stillImage || movie.posterImage} fallbackIdx={1} onPreview={() => {}} onChange={() => {}} />
            </div>
          </div>
          <div className="bg-zinc-900/30 p-12 rounded-[2.5rem] border border-white/5 space-y-12">
            <div className="space-y-10">
              <div className="space-y-4"><label className="text-[10px] font-black uppercase text-zinc-600">영화 이름</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent text-5xl font-black outline-none border-b border-white/5 pb-4 transition-all" /></div>
              <div className="space-y-4"><label className="text-[10px] font-black uppercase text-zinc-600">태그</label><textarea value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-black text-amber-500 min-h-[100px]" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
              <div className="space-y-4"><label className="text-xl font-black">시놉시스</label><textarea value={formData.synopsis} onChange={(e) => setFormData({...formData, synopsis: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm min-h-[200px]" /></div>
              <div className="space-y-4"><label className="text-xl font-black">연출의도</label><textarea value={formData.directorIntent} onChange={(e) => setFormData({...formData, directorIntent: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm min-h-[200px]" /></div>
            </div>
          </div>
        </form>
        <div className="space-y-10 pt-20 border-t border-white/10">
          <div className="space-y-2"><h2 className="text-3xl font-black uppercase">대시보드 통계</h2><p className="text-[11px] font-bold text-zinc-500 uppercase">최근 30일 지표</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4"><MetricCard label="조회수" value="106" /><MetricCard label="시청 시간" value="0.6" unit="h" /><MetricCard label="피드백" value="18" /><MetricCard label="저장 수" value="42" /><MetricCard label="완주율" value="67" unit="%" /></div>
              <ChartModule activeTab={activeChartTab} onTabChange={setActiveChartTab} />
            </div>
            <div className="bg-zinc-900 p-8 rounded-[2rem] border border-white/10 space-y-6 flex flex-col justify-center">
              <h4 className="text-2xl font-black tracking-tighter">AI 분석 제안</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">특정 구간의 이탈이 관찰됩니다. 보고서를 확인해보세요.</p>
              <button type="button" onClick={() => setIsReportOpen(true)} className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase">세부 분석 보고서 보기</button>
            </div>
          </div>
        </div>
        <div className="space-y-10 pb-32">
          <div className="flex items-end justify-between">
            <div><h2 className="text-3xl font-black uppercase">관객 피드백</h2><p className="text-[11px] font-bold text-zinc-500 uppercase mt-1">총 {FEEDBACKS.length}건 · 평균 {AI_SUMMARY.avgRating}점</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            {/* Sidebar */}
            <div className="flex flex-col gap-3 h-[520px] overflow-y-auto scrollbar-hide">
              <FeedbackFolder title="전체 피드백" count={FEEDBACKS.length} icon="📂" isActive={activeFeedbackFolder==="전체 피드백"} onClick={()=>setActiveFeedbackFolder("전체 피드백")} />
              <FeedbackFolder title="타임스탬프" count={TIMESTAMP_FEEDBACKS.length} icon="⏱" isActive={activeFeedbackFolder==="타임스탬프"} onClick={()=>setActiveFeedbackFolder("타임스탬프")} />
              <FeedbackFolder title="AI 요약" count="NEW" icon="🧠" isActive={activeFeedbackFolder==="AI 요약"} onClick={()=>setActiveFeedbackFolder("AI 요약")} />
              {/* Rating breakdown */}
              <div className="mt-2 p-5 bg-zinc-900/40 border border-white/5 rounded-2xl space-y-3">
                <p className="text-[10px] font-black text-zinc-500 uppercase">별점 분포</p>
                {[5,4,3,2,1].map(s => {
                  const cnt = FEEDBACKS.filter(f=>f.rating===s).length;
                  const pct = Math.round(cnt/FEEDBACKS.length*100);
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-zinc-500 w-4">{s}★</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{width:`${pct}%`}} />
                      </div>
                      <span className="text-[10px] font-black text-zinc-600 w-6">{cnt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Content */}
            <div className="bg-zinc-900/40 rounded-[2rem] border border-white/10 p-8 h-[520px] overflow-y-auto scrollbar-hide">
              {activeFeedbackFolder === "전체 피드백" ? (
                <div className="space-y-4">
                  {FEEDBACKS.map(fb => (
                    <div key={fb.id} className="p-6 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[10px] font-black text-black">{fb.avatar}</div>
                          <div>
                            <p className="text-sm font-black">{fb.user}</p>
                            <StarRow rating={fb.rating} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600">{fb.date}</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed mb-3">{fb.text}</p>
                      <div className="flex gap-2">{fb.tags.map(t=><span key={t} className="text-[9px] font-black px-2 py-1 rounded-full bg-white/5 text-zinc-500">{t}</span>)}</div>
                    </div>
                  ))}
                </div>
              ) : activeFeedbackFolder === "타임스탬프" ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <span className="text-2xl">⏱</span>
                    <div>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">타임스탬프 피드백</p>
                      <p className="text-sm font-bold text-white">관객이 특정 장면에 남긴 실시간 코멘트</p>
                    </div>
                  </div>
                  {/* Timeline Bar */}
                  <div className="relative">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                      {TIMESTAMP_FEEDBACKS.map(tf => (
                        <div key={tf.id} className="absolute top-0 h-full w-1 rounded-full"
                          style={{
                            left: `${(tf.timeMs / 1440) * 100}%`,
                            backgroundColor: tf.sentiment === "positive" ? "#10b981" : tf.sentiment === "negative" ? "#ef4444" : "#f59e0b"
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-zinc-600">
                      <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:16</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-[9px] font-black">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>긍정</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/>중립</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"/>부정</span>
                    </div>
                  </div>
                  {/* Timestamp list */}
                  <div className="space-y-3">
                    {TIMESTAMP_FEEDBACKS.map(tf => (
                      <div key={tf.id} className="flex gap-4 p-4 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition group">
                        {/* Timestamp badge */}
                        <div className="shrink-0 flex flex-col items-center gap-1">
                          <span className="px-3 py-1.5 rounded-xl font-black text-[11px] tabular-nums bg-zinc-800 text-amber-500 border border-amber-500/20 group-hover:border-amber-500/40 transition">
                            {tf.time}
                          </span>
                          <div className="w-0.5 flex-1 rounded-full" style={{backgroundColor: tf.sentiment === "positive" ? "rgba(16,185,129,0.3)" : tf.sentiment === "negative" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[9px] font-black text-black shrink-0">{tf.avatar}</div>
                            <span className="text-xs font-black">{tf.user}</span>
                            <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${
                              tf.sentiment === "positive" ? "bg-emerald-500/10 text-emerald-400" :
                              tf.sentiment === "negative" ? "bg-red-500/10 text-red-400" :
                              "bg-amber-500/10 text-amber-400"
                            }`}>
                              {tf.sentiment === "positive" ? "👍 긍정" : tf.sentiment === "negative" ? "👎 부정" : "😐 중립"}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed">{tf.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* AI Badge */}
                  <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <span className="text-2xl">🧠</span>
                    <div><p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">AI 분석 완료</p><p className="text-sm font-bold text-white">총 {FEEDBACKS.length}개의 피드백을 분석했습니다</p></div>
                  </div>
                  {/* Keywords */}
                  <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-3">주요 키워드</p>
                    <div className="flex flex-wrap gap-2">
                      {AI_SUMMARY.keywords.map((k,i)=>(
                        <span key={k} className="px-3 py-1.5 rounded-full text-[11px] font-black border transition"
                          style={{fontSize:`${12+i*1.5}px`, backgroundColor:`rgba(245,158,11,${0.05+i*0.02})`, borderColor:`rgba(245,158,11,${0.1+i*0.04})`, color:`rgba(255,255,255,${0.4+i*0.07})`}}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Positives */}
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase mb-3">👍 강점</p>
                    <div className="space-y-2">
                      {AI_SUMMARY.positives.map(p=>(
                        <div key={p} className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                          <span className="text-emerald-500 mt-0.5 text-sm">✓</span>
                          <p className="text-sm text-zinc-300">{p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Improvements */}
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase mb-3">⚠ 개선 포인트</p>
                    <div className="space-y-2">
                      {AI_SUMMARY.improvements.map(imp=>(
                        <div key={imp} className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                          <span className="text-orange-400 mt-0.5 text-sm">!</span>
                          <p className="text-sm text-zinc-300">{imp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsReportOpen(false)} />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <header className="p-8 border-b border-white/5 flex justify-between items-center shrink-0">
              <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">🧠 AI Intelligence · MOV:ON Core</p>
                <h3 className="text-2xl font-black uppercase">세부 분석 보고서</h3>
                <p className="text-xs text-zinc-500 mt-1">생성일: 2026.05.13 · 분석 대상: {movie?.title}</p>
              </div>
              <button onClick={() => setIsReportOpen(false)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition">✕</button>
            </header>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Summary Banner */}
              <section className="p-6 bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl">
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">종합 평가</p>
                <p className="text-base font-bold text-white leading-relaxed">"<span className="text-amber-400">{movie?.title}</span>"은 강렬한 영상미와 섬세한 배우 연기로 관객에게 깊은 인상을 남기고 있습니다. 완주율 67%는 독립영화 평균 대비 <span className="text-emerald-400">+18%p</span> 높은 수치입니다.</p>
              </section>
              {/* Score Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label:"감성 점수", value:"84", unit:"/100", color:"text-amber-400" },
                  { label:"참여도", value:"High", unit:"", color:"text-emerald-400" },
                  { label:"재시청 의향", value:"76", unit:"%", color:"text-sky-400" },
                  { label:"추천 의향", value:"89", unit:"%", color:"text-purple-400" },
                ].map(sc => (
                  <div key={sc.label} className="p-5 bg-white/3 border border-white/5 rounded-2xl text-center hover:border-white/10 transition">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">{sc.label}</p>
                    <p className={`text-3xl font-black ${sc.color}`}>{sc.value}<span className="text-sm text-zinc-500">{sc.unit}</span></p>
                  </div>
                ))}
              </div>
              {/* Dropout Timeline */}
              <section className="p-6 bg-white/3 border border-white/5 rounded-3xl space-y-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">📉 이탈 구간 분석</p>
                <p className="text-xs text-zinc-500">시청 진행률에 따른 이탈 분포입니다. 붉은 구간에서 개선이 필요합니다.</p>
                <div className="flex items-end gap-1 h-16">
                  {[72,68,65,80,85,60,45,50,72,80,78,82].map((h,i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all" style={{ height:`${h}%`, backgroundColor: h<60 ? "rgba(239,68,68,0.6)" : h<72 ? "rgba(245,158,11,0.5)" : "rgba(34,197,94,0.4)" }} />
                  ))}
                </div>
                <div className="flex justify-between text-[9px] font-black text-zinc-600">
                  <span>0분</span><span>6분</span><span>12분</span><span>18분</span><span>24분</span>
                </div>
                <div className="flex gap-4 text-[9px] font-black">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/60 inline-block"/>이탈 위험</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-500/50 inline-block"/>주의 구간</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/40 inline-block"/>안정 구간</span>
                </div>
              </section>
              {/* Keywords + Sentiment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="p-6 bg-white/3 border border-white/5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">💬 관객 키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {AI_SUMMARY.keywords.map((k,i) => (
                      <span key={k} className="px-3 py-1 rounded-full text-[11px] font-black border"
                        style={{backgroundColor:`rgba(245,158,11,${0.05+i*0.025})`,borderColor:`rgba(245,158,11,${0.15+i*0.04})`,color:`rgba(255,255,255,${0.5+i*0.06})`}}>
                        {k}
                      </span>
                    ))}
                  </div>
                </section>
                <section className="p-6 bg-white/3 border border-white/5 rounded-3xl space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">📊 감성 분포</p>
                  {[{label:"긍정",pct:72,color:"bg-emerald-500"},{label:"중립",pct:20,color:"bg-zinc-500"},{label:"부정",pct:8,color:"bg-red-500"}].map(s=>(
                    <div key={s.label} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-zinc-500"><span>{s.label}</span><span>{s.pct}%</span></div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${s.color} rounded-full`} style={{width:`${s.pct}%`}} /></div>
                    </div>
                  ))}
                </section>
              </div>
              {/* Recommendations */}
              <section className="p-6 bg-white/3 border border-white/5 rounded-3xl space-y-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">💡 AI 개선 제안</p>
                {[
                  { icon:"✂️", title:"12~18분 구간 재편집 검토", desc:"해당 구간의 이탈률이 35%로 가장 높습니다. 씬 압축 또는 템포 조절을 권장합니다." },
                  { icon:"🎬", title:"결말부 자막 보강", desc:"열린 결말에 대한 혼재된 반응이 있습니다. 감독의 의도를 전달하는 짧은 자막 추가를 고려하세요." },
                  { icon:"📢", title:"SNS 숏폼 클립 제작", desc:"감성 점수가 높은 3~6분 구간은 SNS 바이럴 잠재력이 높습니다." },
                ].map(r => (
                  <div key={r.title} className="flex items-start gap-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <span className="text-xl shrink-0">{r.icon}</span>
                    <div><p className="text-sm font-black text-white mb-1">{r.title}</p><p className="text-xs text-zinc-400 leading-relaxed">{r.desc}</p></div>
                  </div>
                ))}
              </section>
            </div>
            {/* Footer */}
            <footer className="p-6 border-t border-white/5 flex justify-between items-center bg-white/2 shrink-0">
              <span className="text-[10px] font-bold text-zinc-600 uppercase">Generated by MOV:ON AI Core · {new Date().toLocaleDateString('ko-KR')}</span>
              <button onClick={() => { setIsReportSaving(true); setTimeout(() => { setIsReportSaving(false); showToast("PDF로 저장되었습니다"); }, 1000); }} disabled={isReportSaving}
                className="px-8 py-3 bg-amber-500 text-black font-black uppercase rounded-xl hover:bg-amber-400 transition disabled:opacity-50">
                {isReportSaving ? "저장 중..." : "📄 PDF 저장"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default CreatorDashboardPage;
