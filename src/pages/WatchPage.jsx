import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../data/movies";
import NotFound from "./NotFound";
import movieVideo from "../assets/movie.mp4";
import adImage from "../assets/ad.png";
import ad2Image from "../assets/ad2.png";

// ─── Demo comments ────────────────────────────────────────────────────────────
const INITIAL_COMMENTS = [
  { id: 1, author: "김민지", rating: 5, text: "마지막 장면이 계속 생각나네요. 다음 작품도 기대됩니다!", time: "3시간 전", isDonation: false },
  { id: 2, author: "이준호", rating: 4, text: "중반부 리듬이 조금 느슨했지만, 분위기는 정말 좋았습니다.", time: "5시간 전", isDonation: false },
  { id: 3, author: "박서연", rating: 5, text: "색감이 영화의 정서랑 잘 맞아서 몰입됐어요.", time: "7시간 전", isDonation: false },
  { id: 4, author: "최도현", rating: 4, text: "대사가 많지 않은데도 인물 감정이 잘 전달됩니다.", time: "9시간 전", isDonation: false },
  { id: 5, author: "정유리", rating: 3, text: "음악이 들어오는 타이밍이 인상적이었습니다.", time: "어제", isDonation: false },
  { id: 6, author: "한승민", rating: 5, text: "상영회에서 보면 더 좋을 것 같은 작품이에요.", time: "어제", isDonation: false },
  { id: 7, author: "오지수", rating: 4, text: "배우들의 케미가 정말 환상적이네요. 특히 후반 장면이 압도적이었어요.", time: "이틀 전", isDonation: false },
  { id: 8, author: "윤채원", rating: 5, text: "이 영화는 두 번 봐야 합니다. 디테일이 살아있어요.", time: "이틀 전", isDonation: false },
  { id: 9, author: "강태양", rating: 4, text: "올해 본 단편 중 가장 긴 여운이 남는 작품이었습니다.", time: "3일 전", isDonation: false },
  { id: 10, author: "임하은", rating: 5, text: "배경 음악이 너무 좋아서 따로 찾아 들었어요.", time: "4일 전", isDonation: false },
  { id: 11, author: "황주혁", rating: 4, text: "현실의 고단함을 잊게 해주는 영화적 체험이었습니다.", time: "5일 전", isDonation: false },
  { id: 12, author: "MOV:ON", rating: 5, text: "감독님의 예술적 감각이 돋보이는 작품 함께 해주셔서 감사합니다! 🎬", time: "1주일 전", isDonation: true, isDirector: true },
];

// ─── CommentSection component ──────────────────────────────────────────────────
const CommentSection = () => {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const listRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRating === 0) { setSubmitError("별점을 선택해주세요."); return; }
    if (!newComment.trim()) { setSubmitError("댓글을 입력해주세요."); return; }
    setSubmitError("");
    const comment = {
      id: Date.now(),
      author: "나",
      rating: selectedRating,
      text: newComment.trim(),
      time: "방금 전",
      isDonation: false,
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    setSelectedRating(0);
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  return (
    <section className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[580px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/80 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-black tracking-tighter text-white uppercase">
            관객 댓글
          </h2>
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-black text-amber-500">
            {comments.length}
          </span>
        </div>
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          Live Conversation
        </div>
      </div>

      {/* Scrollable comment list */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto scrollbar-hide p-5 space-y-3"
      >
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`group flex flex-col gap-2 p-4 rounded-xl border transition-all duration-300 ${comment.isDonation
                ? "bg-amber-500/5 border-amber-500/20 shadow-[0_6px_20px_-8px_rgba(245,158,11,0.15)]"
                : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12]"
              }`}
          >
            {/* Author row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${comment.isDonation ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                  {comment.author[0]}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${comment.isDonation ? "text-amber-400" : "text-zinc-400"}`}>
                  {comment.author}{comment.isDirector && <span className="ml-1">👑</span>}
                </span>
                {comment.rating > 0 && (
                  <span className="text-[10px] tracking-tight" aria-label={`${comment.rating}점`}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={s <= comment.rating ? "text-amber-400" : "text-zinc-700"}>★</span>
                    ))}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{comment.time}</span>
            </div>

            {/* Text */}
            <p
              className={`text-sm font-medium leading-relaxed ${comment.isDonation ? "text-zinc-200" : "text-zinc-300"
                }`}
            >
              {comment.text}
            </p>

            {/* Hover actions */}
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] font-black text-zinc-600 hover:text-amber-500 transition-colors uppercase tracking-widest">
                좋아요
              </button>
              <button className="text-[10px] font-black text-zinc-600 hover:text-amber-500 transition-colors uppercase tracking-widest">
                답글
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="px-5 py-4 bg-zinc-900/80 border-t border-white/10 shrink-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {/* Star rating row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">별점 남기기</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => { setSelectedRating(star); setSubmitError(""); }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-xl leading-none transition-all duration-100 hover:scale-110 active:scale-95"
                  aria-label={`${star}점`}
                >
                  <span className={(hoverRating || selectedRating) >= star ? "text-amber-400" : "text-zinc-700"}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={newComment}
            onChange={(e) => { setNewComment(e.target.value); setSubmitError(""); }}
            placeholder="댓글을 입력하세요..."
            rows={2}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none placeholder:text-zinc-600"
          />

          {/* Error + submit row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400">{submitError}</span>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

// ─── WatchPage ─────────────────────────────────────────────────────────────────
const WatchPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const movie = movies.find((m) => m.id === parseInt(movieId));

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackTime, setFeedbackTime] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      videoRef.current.currentTime = (x / rect.width) * duration;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!movie) return <NotFound />;

  return (
    <main className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      {/* ── 1. Full-Viewport Video Section ── */}
      <section className="relative w-full h-screen shrink-0 bg-black overflow-hidden">
        {/* Top header overlay */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-8 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:scale-110 transition p-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-white hover:scale-110 transition p-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        {/* Video / image background */}
        {movie.title === "소란스러운 밤" ? (
          <video
            ref={videoRef}
            src={movieVideo}
            autoPlay
            muted
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full object-cover opacity-80 cursor-pointer"
          />
        ) : (
          <img
            src={movie.stillImage}
            alt="Movie Still"
            className="w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Playback controls */}
        <div className="absolute bottom-12 left-0 right-0 px-12 flex items-center gap-6">
          <button
            onClick={togglePlay}
            className="text-white hover:scale-110 transition-transform p-2 shrink-0"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div
            className="relative h-1.5 flex-1 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl -ml-2"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. Scrollable content area ── */}
      <div className="max-w-7xl mx-auto w-full px-8 py-16">
        {/* Movie header */}
        <div className="flex justify-between items-start mb-10">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-white">
              {movie.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
              </div>
              <p className="font-bold text-zinc-400 text-sm">
                {movie.director} / {movie.team}
              </p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex gap-1 justify-end">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill={i <= 4 ? "#FBBF24" : "none"}
                  stroke="#FBBF24"
                  strokeWidth="1.5"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-xs font-bold text-zinc-500">
              평점 {movie.rating} / {movie.ratingCount}명 평가
            </p>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Comment section */}
          <div className="flex-1 min-w-0">
            <CommentSection />
          </div>

          {/* Right: Sidebar — locked to same height as comment box */}
          <aside className="w-full lg:w-[380px] shrink-0 sticky top-8 self-start h-[580px] flex flex-col gap-4">
            {/* Director's word */}
            <div className="bg-white/[0.04] border border-white/10 px-5 py-4 rounded-xl shrink-0 hover:bg-white/[0.07] transition-colors cursor-default group">
              <div className="inline-block bg-amber-500 px-3 py-0.5 rounded text-[10px] font-black text-black mb-3 group-hover:bg-amber-400 transition-colors">
                감독의 한마디
              </div>
              <p className="text-sm font-bold text-zinc-300 leading-relaxed">
                작은 침묵 속에서도 마음은 계속 움직인다는 것을 보여주고 싶었습니다.
              </p>
            </div>

            {/* Ads */}
            <div className="flex flex-col gap-3 flex-1 min-h-0">
              <p className="text-[10px] font-bold text-zinc-500 text-right uppercase tracking-tighter shrink-0">
                수익의 일부는 영화 제작 지원에 사용됩니다
              </p>
              <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
                <a href="https://thon.khlug.org" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src={adImage} alt="Advertisement 1" className="w-full h-full object-contain" />
                </a>
              </div>
              <div className="flex-1 min-h-0 bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
                <a href="https://thon.khlug.org" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src={ad2Image} alt="Advertisement 2" className="w-full h-full object-contain" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── 3. Feedback modal ── */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowFeedbackModal(false);
              setFeedbackError("");
              setFeedbackSuccess(false);
            }}
          />
          <div className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl p-8 shadow-2xl space-y-5">
            {/* Title row */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black tracking-tight text-white">
                피드백 보내기
              </h2>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackError("");
                  setFeedbackSuccess(false);
                }}
                className="text-zinc-500 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">
              감독님에게 장면별 피드백이나 응원의 메시지를 남겨주세요.
            </p>

            {/* Timestamp field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                피드백 위치
              </label>
              <p className="text-[11px] text-zinc-600 font-medium">
                어떤 장면에 대한 피드백인지 시간을 입력해주세요.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackTime}
                  onChange={(e) => { setFeedbackTime(e.target.value); setFeedbackError(""); }}
                  placeholder="예: 12:34"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const totalSec = Math.floor(currentTime);
                    const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
                    const ss = String(totalSec % 60).padStart(2, "0");
                    setFeedbackTime(`${mm}:${ss}`);
                    setFeedbackError("");
                  }}
                  className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
                >
                  현재 시점 사용
                </button>
              </div>
            </div>

            {/* Content field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                내용
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => { setFeedbackText(e.target.value); setFeedbackError(""); }}
                placeholder="내용을 입력해주세요..."
                rows={5}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none placeholder:text-zinc-600"
              />
            </div>

            {/* Inline feedback */}
            {feedbackError && (
              <p className="text-amber-400 text-xs font-bold">{feedbackError}</p>
            )}
            {feedbackSuccess && (
              <p className="text-emerald-400 text-xs font-bold">피드백이 전송되었습니다.</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 pt-1">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackError("");
                  setFeedbackSuccess(false);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-zinc-400 font-bold text-sm hover:bg-white/10 transition"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (!feedbackTime.trim()) {
                    setFeedbackError("피드백 위치를 입력해주세요.");
                    return;
                  }
                  if (!feedbackText.trim()) {
                    setFeedbackError("피드백 내용을 입력해주세요.");
                    return;
                  }
                  setFeedbackError("");
                  setFeedbackSuccess(true);
                  setTimeout(() => {
                    setFeedbackText("");
                    setFeedbackTime("");
                    setFeedbackSuccess(false);
                    setShowFeedbackModal(false);
                  }, 1200);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-amber-500 text-black font-black text-sm hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                전송하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default WatchPage;
