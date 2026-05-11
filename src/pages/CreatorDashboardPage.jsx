import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { movies } from "../data/movies";
import Header from "../components/organisms/Header";
import FeedbackPage from './FeedbackPage';

// --- SUB-COMPONENTS ---

const AssetCard = ({ title, type, duration, status, date, thumbnail, onPreview, onChange }) => (
  <div className="group relative bg-zinc-900/50 rounded-[2rem] border border-white/5 overflow-hidden transition-all hover:border-white/10 hover:bg-zinc-900 shadow-xl flex flex-col h-[400px]">
    <div className="relative h-48 bg-zinc-800 overflow-hidden shrink-0">
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
          <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">No Thumbnail</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => { e.preventDefault(); onPreview(); }}
          className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center text-xl shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
        >
          ▶
        </button>
      </div>

      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-black text-white border border-white/10">
        {duration}
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1 justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black tracking-[0.2em] text-zinc-500 uppercase">{type}</h4>
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
            {status}
          </span>
        </div>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{date} 업로드</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button 
          onClick={(e) => { e.preventDefault(); onPreview(); }}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition"
        >
          미리보기
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); onChange(); }}
          className="w-full py-3 bg-white/5 hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-zinc-400 hover:text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition"
        >
          영상 변경
        </button>
      </div>
    </div>
  </div>
);

const GenreChip = ({ label, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 border
      ${isSelected 
        ? "bg-amber-500 text-black border-amber-500 shadow-[0_5px_15px_-5px_rgba(245,158,11,0.5)]" 
        : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
      }`}
  >
    {label}
  </button>
);

const MetricCard = ({ label, value, unit = "" }) => (
  <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-1 group hover:border-white/10 transition-colors">
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-black text-white group-hover:text-amber-500 transition-colors">{value}</span>
      {unit && <span className="text-xs font-bold text-zinc-600">{unit}</span>}
    </div>
  </div>
);

const ChartModule = ({ activeTab, onTabChange }) => {
  const tabs = ["조회수", "시청 시간", "피드백", "완주율"];
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Realistic mock data
  const dataMap = {
    "조회수": {
      unit: "회",
      yLabels: ["0", "50", "100", "150", "200"],
      points: [
        { date: "05.03", val: 42 },
        { date: "05.04", val: 85 },
        { date: "05.05", val: 124 },
        { date: "05.06", val: 98 },
        { date: "05.07", val: 156 },
        { date: "05.08", val: 132 },
        { date: "05.09", val: 184 }
      ]
    },
    "시청 시간": {
      unit: "시간",
      yLabels: ["0", "2", "4", "6", "8"],
      points: [
        { date: "05.03", val: 1.2 },
        { date: "05.04", val: 2.5 },
        { date: "05.05", val: 4.8 },
        { date: "05.06", val: 3.2 },
        { date: "05.07", val: 5.6 },
        { date: "05.08", val: 4.9 },
        { date: "05.09", val: 7.2 }
      ]
    },
    "피드백": {
      unit: "건",
      yLabels: ["0", "5", "10", "15", "20"],
      points: [
        { date: "05.03", val: 2 },
        { date: "05.04", val: 5 },
        { date: "05.05", val: 12 },
        { date: "05.06", val: 8 },
        { date: "05.07", val: 15 },
        { date: "05.08", val: 10 },
        { date: "05.09", val: 18 }
      ]
    },
    "완주율": {
      unit: "%",
      yLabels: ["0", "25", "50", "75", "100"],
      points: [
        { date: "05.03", val: 45 },
        { date: "05.04", val: 52 },
        { date: "05.05", val: 68 },
        { date: "05.06", val: 59 },
        { date: "05.07", val: 74 },
        { date: "05.08", val: 67 },
        { date: "05.09", val: 82 }
      ]
    }
  };

  const currentData = dataMap[activeTab];
  const maxVal = parseFloat(currentData.yLabels[currentData.yLabels.length - 1]);
  
  // Coordinate calculations
  const width = 800;
  const height = 240;
  const padding = { top: 20, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index) => padding.left + (index * (chartWidth / (currentData.points.length - 1)));
  const getY = (val) => padding.top + chartHeight - ((val / maxVal) * chartHeight);

  const pathD = currentData.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.val)}`).join(' ');

  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
      <div className="flex border-b border-white/5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab ? "bg-white/5 text-amber-500" : "text-zinc-600 hover:text-zinc-400"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-8 h-80 relative group">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Y Axis Grid & Labels */}
          {currentData.yLabels.map((label, i) => {
            const y = getY(parseFloat(label));
            return (
              <g key={label}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                <text x={padding.left - 15} y={y + 4} textAnchor="end" className="fill-zinc-600 text-[10px] font-bold">{label}</text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {currentData.points.map((p, i) => (
            <text key={i} x={getX(i)} y={height - 10} textAnchor="middle" className="fill-zinc-600 text-[10px] font-bold">{p.date}</text>
          ))}

          {/* Main Line Path */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="currentColor" 
            className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500"
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {currentData.points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
              <circle 
                cx={getX(i)} 
                cy={getY(p.val)} 
                r="4" 
                className={`fill-amber-500 transition-all duration-300 ${hoveredPoint === i ? 'r-6' : 'r-4'}`} 
              />
              {/* Invisible touch target */}
              <rect 
                x={getX(i) - 20} 
                y={padding.top} 
                width="40" 
                height={chartHeight} 
                fill="transparent" 
                className="cursor-pointer"
              />
            </g>
          ))}

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <g className="pointer-events-none">
              <line 
                x1={getX(hoveredPoint)} y1={padding.top} 
                x2={getX(hoveredPoint)} y2={height - padding.bottom} 
                stroke="white" strokeOpacity="0.1" strokeDasharray="4 4" 
              />
              <foreignObject 
                x={getX(hoveredPoint) - 60} 
                y={getY(currentData.points[hoveredPoint].val) - 60} 
                width="120" 
                height="50"
              >
                <div className="bg-zinc-900 border border-white/10 rounded-lg p-2 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                    {currentData.points[hoveredPoint].date}
                  </span>
                  <span className="text-[11px] font-black text-white">
                    {activeTab}: <span className="text-amber-500">{currentData.points[hoveredPoint].val}{currentData.unit}</span>
                  </span>
                </div>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>
      <div className="px-8 pb-4 flex justify-between items-center">
         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Y-Axis: {activeTab} ({currentData.unit})</span>
         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">X-Axis: 날짜</span>
      </div>
    </div>
  );
};

const FeedbackFolder = ({ title, count, description, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-3 group
      ${isActive 
        ? "bg-amber-500/10 border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]" 
        : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60"
      }`}
  >
    <div className="flex items-center justify-between">
      <span className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? "bg-amber-500 text-black" : "bg-white/5 text-zinc-500"}`}>
        {count}
      </span>
    </div>
    <div>
      <h5 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isActive ? "text-amber-500" : "text-white"}`}>
        {title}
      </h5>
      <p className="text-[10px] font-bold text-zinc-500 leading-tight">
        {description}
      </p>
    </div>
  </button>
);

const CreatorDashboardPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    synopsis: "",
    directorIntent: "",
    directorComment: "",
    genres: []
  });
  
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [activeChartTab, setActiveChartTab] = useState("조회수");
  const [activeFeedbackFolder, setActiveFeedbackFolder] = useState("전체 피드백");
  
  const [toast, setToast] = useState({ show: false, message: "" });
  const [modal, setModal] = useState({ show: false, type: "", content: null });
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReportSaving, setIsReportSaving] = useState(false);

  const genreList = [
    "액션", "코미디", "드라마", "로맨스", "스릴러", "공포",
    "SF", "범죄", "전쟁", "뮤지컬", "다큐멘터리", "애니메이션"
  ];

  const feedbackData = {
    "전체 피드백": [
      { time: "03:12", user: "김강민", text: "빛이 들어오는 방향과 인물의 침묵이 잘 맞물려서 장면의 외로움이 설득력 있게 전달됩니다.", sentiment: "Positive" },
      { time: "11:40", user: "신연호", text: "두 인물이 마주 앉는 장면에서 시선 처리가 좋아 긴장감이 생깁니다. 다만 대사가 조금 더 적었어도 좋았을 것 같아요.", sentiment: "Neutral" },
      { time: "19:05", user: "이혜리", text: "음악이 들어오는 타이밍이 조금 빠르게 느껴집니다. 한 박자 늦추면 감정이 더 자연스러울 것 같습니다.", sentiment: "Warning" },
      { time: "24:00", user: "박준영", text: "엔딩의 여운은 좋지만, 마지막 대사가 이미지에 비해 조금 설명적으로 느껴집니다.", sentiment: "Neutral" }
    ],
    "장면별 피드백": [
      { time: "00:48 오프닝", user: "관객A", text: "오프닝에서 보여주는 공간의 질감이 영화 전체의 톤을 잘 잡아줍니다.", sentiment: "Positive" },
      { time: "07:12 첫 만남", user: "관객B", text: "두 인물이 처음 만날 때의 거리감이 렌즈의 깊이감을 통해 잘 표현되었습니다.", sentiment: "Positive" },
      { time: "13:40 갈등 장면", user: "관객C", text: "갈등이 폭발하기 전의 정적이 조금 더 길었으면 긴장감이 더 극대화되었을 것 같습니다.", sentiment: "Neutral" },
      { time: "21:08 엔딩", user: "관객D", text: "인물이 화면 밖으로 사라진 후에도 남겨진 배경을 오래 보여준 선택이 인상적입니다.", sentiment: "Positive" }
    ],
    "긍정적 반응": [
      { time: "Acting", user: "리뷰어1", text: "대사가 많지 않은데도 인물의 감정선이 따라가집니다. 특히 후반부 정적이 오래 남습니다.", sentiment: "Positive" },
      { time: "Cinematography", user: "리뷰어2", text: "빛과 어둠을 활용한 대비가 인물의 내면적 갈등을 훌륭하게 보좌합니다.", sentiment: "Positive" },
      { time: "Sound", user: "리뷰어3", text: "음악을 과하게 쓰지 않아서 오히려 인물의 표정과 공간감이 더 잘 살아납니다.", sentiment: "Positive" }
    ],
    "개선 요청": [
      { time: "Pacing", user: "피드백A", text: "중반부 갈등 장면은 감정이 폭발하기 전에 쌓이는 과정이 조금 더 필요해 보입니다.", sentiment: "Warning" },
      { time: "Narrative", user: "피드백B", text: "인물의 선택이 중요한 장면인데, 그 선택을 하게 된 이유가 한두 컷 정도 더 있으면 좋겠습니다.", sentiment: "Neutral" },
      { time: "Mixing", user: "피드백C", text: "카페 장면에서 주변 소음이 인물의 대사를 조금 가리는 부분이 있습니다.", sentiment: "Warning" }
    ],
    "AI 요약": [] // Placeholder for AI Summary view
  };

  const feedbackFolders = [
    { title: "전체 피드백", count: 18, description: "관객들이 남긴 모든 의견입니다.", icon: "📂" },
    { title: "장면별 피드백", count: 12, description: "특정 타임라인에 기록된 반응입니다.", icon: "⏱" },
    { title: "긍정적 반응", count: 9, description: "작품의 강점으로 언급된 내용입니다.", icon: "✨" },
    { title: "개선 요청", count: 4, description: "보완이 필요한 부분에 대한 의견입니다.", icon: "💡" },
    { title: "AI 요약", count: "NEW", description: "전체 피드백을 AI가 분석한 리포트입니다.", icon: "🧠" },
  ];

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === parseInt(movieId)) || movies[0];
    if (foundMovie) {
      setMovie(foundMovie);
      setFormData({
        title: foundMovie.title || "사라진 소리의 궤적",
        tags: foundMovie.tags ? foundMovie.tags.join(", ") : "#기억, #도시, #실종, #아날로그",
        synopsis: "사라진 형의 마지막 녹음 파일을 발견한 대학생 민재는, 그 안에 반복적으로 들리는 낯선 지하철 안내음과 오래된 극장의 소음을 따라 도시 곳곳을 헤맨다. 단서는 명확하지 않고, 만나는 사람들은 모두 형을 조금씩 다르게 기억한다. 민재는 추적을 계속할수록 형의 실종이 단순한 사건이 아니라, 자신이 외면해온 가족의 침묵과 연결되어 있음을 깨닫는다. 영화는 도시의 밤, 오래된 테이프 소리, 희미한 불빛을 따라가며 기억이 어떻게 왜곡되고 남겨지는지를 조용히 따라간다.",
        directorIntent: "이 작품은 사라진 사람을 찾는 이야기를 빌려, 사실은 남겨진 사람이 자기 기억을 다시 마주하는 과정을 그리고자 했습니다. 추적의 긴장감보다 중요한 것은 단서 사이의 공백, 말하지 못한 감정, 그리고 뒤늦게 떠오르는 죄책감이었습니다. 그래서 카메라는 사건을 빠르게 따라가기보다 인물이 멈추는 순간, 소리를 듣는 순간, 아무 말 없이 같은 장소를 다시 바라보는 순간을 오래 붙잡습니다. 관객이 명확한 해답보다 ‘나에게도 끝내 묻지 못한 질문이 있었는가’를 떠올리길 바랐습니다.",
        directorComment: "누군가를 찾는 일은 결국 자신이 놓친 마음을 다시 보는 일이라고 생각했습니다.",
        genres: foundMovie.genres || ["드라마", "미스터리"]
      });
      setSelectedGenres(foundMovie.genres || ["드라마", "미스터리"]);
    }
  }, [movieId]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const handleSave = (e) => { 
    e.preventDefault(); 
    showToast("변경사항이 저장되었습니다");
  };

  if (!movie) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden pt-4 relative">
      <Header />
      
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-24">
        {/* Custom Toast */}
        {toast.show && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3">
              <span className="text-xl">✅</span>
              {toast.message}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
            <div className="space-y-4">
              <span className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">Creator Dashboard</span>
              <h1 className="text-5xl font-black tracking-tighter leading-none uppercase">감독 영화 수정</h1>
            </div>
            <button type="submit" className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition transform active:scale-95 shadow-[0_10px_30px_-5px_rgba(245,158,11,0.4)]">변경사항 저장</button>
          </div>

          {/* ASSET MANAGEMENT */}
          <div className="space-y-8">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-amber-500" />미디어 에셋 관리</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl h-[400px]">
                <img src={movie.posterImage} alt="Poster" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Active Poster</span>
                    <h3 className="text-xl font-black text-white uppercase truncate leading-tight">{formData.title}</h3>
                  </div>
                  <button type="button" className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition">포스터 변경</button>
                </div>
              </div>
              <AssetCard type="본편 영상" duration="24:16" status="업로드 완료" date="2026.05.09" thumbnail={movie.videoThumbnail || movie.stillImage} onPreview={() => { }} onChange={() => { }} />
              <AssetCard type="예고편 영상" duration="01:32" status="업로드 완료" date="2026.05.09" thumbnail={movie.stillImage || movie.posterImage} onPreview={() => { }} onChange={() => { }} />
            </div>
          </div>

          {/* METADATA EDITOR */}
          <div className="bg-zinc-900/30 p-12 rounded-[2.5rem] border border-white/5 space-y-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block">영화 이름</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-transparent text-5xl font-black outline-none border-b border-white/5 focus:border-amber-500/50 pb-4 transition-all placeholder:text-zinc-800" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 items-start">
                <div className="space-y-8">
                  <div className="flex items-center justify-between"><label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block">장르 선택</label></div>
                  <div className="flex flex-wrap gap-2.5">{genreList.map(genre => (<GenreChip key={genre} label={genre} isSelected={selectedGenres.includes(genre)} onClick={() => toggleGenre(genre)} />))}</div>
                  <div className="pt-4 space-y-3"><p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">선택된 장르</p><div className="flex flex-wrap gap-2">{selectedGenres.map(g => (<span key={g} className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded border border-amber-500/20">{g}</span>))}</div></div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 block">태그 (쉼표로 구분)</label>
                  <textarea value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-black text-amber-500 outline-none focus:border-amber-500/50 min-h-[140px] resize-none transition-all placeholder:text-zinc-800" />
                </div>
              </div>
            </div>

            {/* SYNOPSIS & INTENTION */}
            <div className="space-y-8 pt-10 border-t border-white/5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xl font-black tracking-tight flex items-center gap-3"><span className="w-1.5 h-6 bg-amber-500 rounded-full" />시놉시스</label>
                  <textarea value={formData.synopsis} onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium leading-relaxed outline-none focus:border-amber-500/50 min-h-[200px] resize-none transition-all focus:bg-black/60 shadow-inner" />
                </div>
                <div className="space-y-4">
                  <label className="text-xl font-black tracking-tight flex items-center gap-3"><span className="w-1.5 h-6 bg-zinc-700 rounded-full" />연출의도</label>
                  <textarea value={formData.directorIntent} onChange={(e) => setFormData({ ...formData, directorIntent: e.target.value })} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium leading-relaxed outline-none focus:border-amber-500/50 min-h-[200px] resize-none transition-all focus:bg-black/60" />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* STATISTICS */}
        <div className="space-y-10 pt-20 border-t border-white/10">
          <div className="space-y-2"><h2 className="text-3xl font-black tracking-tighter uppercase">대시보드 통계</h2><p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">최근 30일간의 작품 성과 지표입니다.</p></div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"><MetricCard label="조회수" value="106" unit="views" /><MetricCard label="평균 시청 시간" value="0.6" unit="h" /><MetricCard label="피드백 수" value="18" unit="items" /><MetricCard label="저장 수" value="42" unit="saves" /><MetricCard label="완주율" value="67" unit="%" /></div>
              <ChartModule activeTab={activeChartTab} onTabChange={setActiveChartTab} />
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2rem] border border-white/10 flex flex-col justify-center space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full group-hover:bg-amber-500/10 transition-colors" />
              <div className="space-y-2 relative z-10"><span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Growth Recommendation</span><h4 className="text-2xl font-black tracking-tighter leading-tight">시청 지속시간을 <br /> 15% 더 높일 수 있습니다.</h4></div>
              <p className="text-xs font-medium text-zinc-500 leading-relaxed relative z-10">12분 30초 지점에서 시청 이탈이 집중되고 있습니다. <br /> 해당 구간의 편집이나 서사 호흡을 점검해보세요.</p>
              <button 
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="w-full py-4 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors relative z-10"
              >
                세부 분석 보고서 보기
              </button>
            </div>
          </div>
        </div>
				
        {/* FEEDBACK SECTION */}
        <div className="space-y-10 pb-32">
          <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <div className="space-y-2"><h2 className="text-3xl font-black tracking-tighter uppercase">받은 피드백</h2><p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">관객들의 목소리를 통해 작품의 깊이를 더해보세요.</p></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {feedbackFolders.map(folder => (
                <FeedbackFolder 
                  key={folder.title} 
                  {...folder} 
                  isActive={activeFeedbackFolder === folder.title} 
                  onClick={() => setActiveFeedbackFolder(folder.title)} 
                />
              ))}
            </div>
            <div className="bg-zinc-900/40 rounded-[2rem] border border-white/10 p-10 min-h-[500px] flex flex-col">
              {activeFeedbackFolder === "AI 요약" ? (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-2xl shadow-xl shadow-amber-500/20">🧠</div><div><h4 className="text-2xl font-black tracking-tighter uppercase">AI Feedback Summary</h4><p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Analyzed on 2026.05.09</p></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4"><h5 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em]">핵심 강점</h5><ul className="space-y-3">{["감각적인 미장센과 공간의 질감 활용", "인물의 내면을 따라가는 섬세한 호흡", "아날로그 감성을 활용한 사운드 설계"].map((item, i) => (<li key={i} className="flex gap-3 text-sm font-medium text-zinc-300"><span className="text-amber-500">✓</span> {item}</li>))}</ul></div>
                    <div className="space-y-4"><h5 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">개선 제안</h5><ul className="space-y-3">{["중반부 추적 과정의 리듬감 조절", "일부 대사의 설명적 전달 보강", "엔딩 시퀀스의 시선 처리 지속 시간"].map((item, i) => (<li key={i} className="flex gap-3 text-sm font-medium text-zinc-400"><span className="text-zinc-600">•</span> {item}</li>))}</ul></div>
                  </div>
                  <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4"><h5 className="text-[11px] font-black text-amber-500 uppercase tracking-[0.2em]">Next Steps</h5><p className="text-sm font-medium text-zinc-300 leading-relaxed">"시각적 분위기와 아날로그 사운드의 조화는 훌륭합니다. 다만 관객들이 시선 처리가 좋다고 언급한 11:40 장면과, 리듬이 느슨하다고 지적한 03:12 장면을 비교하여 컷의 호흡을 재조정해보세요. 엔딩의 여운을 극대화하기 위해 마지막 대사를 조금 더 줄이는 방향도 검토해볼 만합니다."</p></div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h4 className="text-xl font-black tracking-tighter uppercase mb-2">{activeFeedbackFolder}</h4>
                  {(feedbackData[activeFeedbackFolder] || feedbackData["전체 피드백"]).map((item, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-black text-amber-500 tracking-widest">{item.time}</span><span className="text-[11px] font-black text-white">{item.user}</span></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${item.sentiment === 'Positive' ? 'text-emerald-500 bg-emerald-500/10' : item.sentiment === 'Warning' ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 bg-zinc-500/10'}`}>{item.sentiment}</span>
                      </div>
                      <p className="text-sm font-medium text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Detailed Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsReportOpen(false)} />
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <header className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                   <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-500">AI Analytics Intelligence</h2>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">세부 분석 보고서</h3>
              </div>
              <button 
                onClick={() => setIsReportOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-white/10 hover:text-white transition"
              >
                ✕
              </button>
            </header>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-zinc-800" /> Executive Summary
                </h4>
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                  <p className="text-lg font-bold leading-relaxed text-zinc-200">
                    "<span className="text-amber-500">{movie?.title}</span>"은(는) 관객들에게 <span className="text-white underline decoration-amber-500/50">강렬한 시각적 인상</span>과 <span className="text-white underline decoration-amber-500/50">몰입감 있는 서사</span>를 제공하고 있습니다. 
                    특히 <span className="text-white font-black">20대 남성</span> 관객층에서 가장 높은 선호도를 보이며, 평균 시청 시간이 업계 평균 대비 <span className="text-emerald-500">+15%</span> 높게 측정되었습니다.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sentiment Score</p>
                  <p className="text-4xl font-black text-white">84<span className="text-lg text-zinc-500 ml-1">/100</span></p>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[84%]" />
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Engagement Level</p>
                  <p className="text-4xl font-black text-white">High</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Top 5% of this month</p>
                </div>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-800" /> AI Semantic Analysis
                  </h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h5 className="text-sm font-black text-white flex items-center gap-2">
                        <span className="text-amber-500">●</span> 시각적 미장센의 탁월성
                      </h5>
                      <p className="text-[13px] text-zinc-400 leading-relaxed font-medium pl-4 border-l border-zinc-800">
                        인공지능 모델은 이 작품의 색감과 조명 활용이 감정선을 극대화하는 데 결정적인 역할을 했다고 분석합니다. 특히 15분 지점의 전개는 관객 몰입도를 최고조로 끌어올립니다.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-black text-white flex items-center gap-2">
                        <span className="text-rose-500">●</span> 개선 권장 사항
                      </h5>
                      <p className="text-[13px] text-zinc-400 leading-relaxed font-medium pl-4 border-l border-zinc-800">
                        중반부의 호흡이 다소 느려지는 경향이 있어, 일부 관객의 이탈이 관찰되었습니다. 편집 과정에서 템포를 조절하거나 배경 음악의 변주를 주는 것을 추천합니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-zinc-900 border border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Audience Keyword</h4>
                  <div className="flex flex-wrap gap-2">
                    {["몽환적인", "압도적인", "실험적인", "감각적", "철학적", "몰입감"].map(kw => (
                      <span key={kw} className="px-3 py-1.5 rounded-full bg-white/5 text-[11px] font-bold text-zinc-300 border border-white/5">#{kw}</span>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Recommendation</p>
                    <p className="text-xs font-bold leading-relaxed text-amber-500/80">
                      이 작품의 '몽환적인' 톤앤매너를 유지하며 다음 프로젝트에서는 보다 명확한 서사 구조를 결합해 보세요.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <footer className="p-8 border-t border-white/5 flex items-center justify-between bg-white/2 shrink-0">
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Report Generated by MOV:ON Deepmind Core v2.4</p>
               <button 
                 onClick={() => {
                   setIsReportSaving(true);
                   setTimeout(() => {
                     setIsReportSaving(false);
                     showToast("PDF로 저장되었습니다");
                   }, 1000);
                 }}
                 disabled={isReportSaving}
                 className="px-6 py-3 bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-amber-400 transition disabled:opacity-50"
               >
                 {isReportSaving ? "SAVING..." : "Download PDF Report"}
               </button>
            </footer>
          </div>
        </div>
      )}

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.01] pointer-events-none select-none tracking-tighter">DASHBOARD</div>
    </main>
  );
};

export default CreatorDashboardPage;
