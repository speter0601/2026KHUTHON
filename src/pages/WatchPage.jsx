import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { movies } from "../data/movies";
import NotFound from "./NotFound";
import movieVideo from "../assets/movie.mp4";
import adImage from "../assets/ad.png";
import ad2Image from "../assets/ad2.png";

const WatchPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const movie = movies.find(m => m.id === parseInt(movieId));

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movieId]);

  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedPercent = x / rect.width;
      const newTime = clickedPercent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!movie) return <NotFound />;

  return (
    <main className="flex flex-col min-h-screen bg-[#050505] text-white font-sans">
      {/* 1. Full Viewport Video Section */}
      <section className="relative w-full h-screen shrink-0 bg-black overflow-hidden group">
        {/* Overlaid Top Header */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-8 bg-gradient-to-b from-black/60 to-transparent">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:scale-110 transition p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className="text-white hover:scale-110 transition p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </button>
        </div>

        {/* Video Background */}
        {/* Video or Image Background */}
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

        {/* Playback Controls Overlay */}
        <div className="absolute bottom-12 left-0 right-0 px-12 flex items-center gap-6">
          {/* Play/Pause Toggle */}
          <button
            onClick={togglePlay}
            className="text-white hover:scale-110 transition-transform p-2 shrink-0"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>

          {/* Progress Bar */}
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

      {/* 2. Scrollable Content Area */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Movie Summary Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-white">{movie.title}</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-zinc-400">{movie.director} / {movie.team}</p>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex gap-1 justify-end">
              {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width="32" height="32" viewBox="0 0 24 24" fill={i <= 4 ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ))}
            </div>
            <p className="text-xs font-bold text-zinc-500">평점 {movie.rating} / {movie.ratingCount}명 평가</p>
          </div>
        </div>

        {/* Review Input Section */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-lg mb-16 text-zinc-400 font-bold text-lg hover:bg-white/10 transition-colors cursor-pointer">
          작품에 대한 평가를 남겨보세요
        </div>

        {/* Main Content Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Column: Comments (flex-1) */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* Regular Review & Reply */}
            <div className="space-y-4">
              <div className="bg-zinc-800/80 border border-white/10 p-6 rounded-lg relative hover:bg-zinc-700/80 transition-colors cursor-default">
                <p className="font-bold text-zinc-100">&lt;{movie.director}&gt; 영화에는 감동이 있다</p>
                <span className="absolute bottom-4 right-6 text-xs font-bold text-zinc-500">김아무개</span>
              </div>
              <div className="flex justify-end">
                <div className="bg-zinc-700/80 border border-white/10 p-6 rounded-lg w-[85%] relative hover:bg-zinc-600/80 transition-colors cursor-default">
                  <p className="font-bold text-zinc-100">감사합니다</p>
                  <span className="absolute bottom-4 right-6 text-xs font-bold text-zinc-500">{movie.director}👑</span>
                </div>
              </div>
            </div>

            {/* Donation Review */}
            <div className="bg-red-500/20 border border-red-500/30 p-8 rounded-lg relative space-y-4 hover:bg-red-500/30 transition-colors cursor-default">
              <div className="text-red-500 font-black text-xl flex items-center gap-2">
                500,000,000 ₩
              </div>
              <p className="font-bold text-zinc-200 leading-relaxed pr-20">
                영화를 보니 연출이 정말 좋았다는 생각을 하게 되네요. <br />
                어떻게 저렇게 창의적인 연출을?ㄷㄷㄷ <br />
                영화 많이 만들어주세요~~~.
              </p>
              <span className="absolute bottom-6 right-8 text-xs font-bold text-zinc-400 flex items-center gap-1">
                김규현 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
              </span>
            </div>

            {/* Spoiler Review */}
            <div
              className="bg-white/10 border border-white/10 p-6 rounded-lg relative cursor-pointer group hover:bg-white/15 transition-colors"
              onClick={() => setShowSpoiler(!showSpoiler)}
            >
              <p className={`font-bold transition-all duration-500 ${showSpoiler ? "text-zinc-200" : "text-zinc-600 blur-[6px] select-none"}`}>
                나는 스포일러 맨 이 영화에서 감독은 죽는다
              </p>
              {!showSpoiler && (
                <div className="absolute inset-0 flex items-center justify-center font-black text-zinc-300 group-hover:text-white transition-colors">
                  (스포일러 보기)
                </div>
              )}
              <span className="absolute bottom-4 right-6 text-[10px] font-bold text-zinc-500">지욱이형이포함됨</span>
            </div>

            {/* Additional User Comments (Massive List for scrolling) */}
            {[
              { text: "군중 속의 고독을 느끼는 현대인들의 공허함을 라디오라는 아날로그 매체로 따뜻하게, 때로는 서늘하게 어루만져 줍니다.", user: "이정우" },
              { text: "마지막 장면이 계속 생각나네요. 다음 작품도 기대됩니다!", user: "박지성" },
              { text: "이런 분위기의 영화 너무 좋아요. 음악 선정도 탁월했습니다.", user: "최수진" },
              { text: "배우들 연기가 정말 좋네요. 보는 내내 시간이 가는 줄 몰랐어요.", user: "정민수" },
              { text: "정말 최고의 영화였습니다! 연출이 미쳤어요.", user: "김철수" },
              { text: "연출력이 돋보이는 작품이네요. 색감이 너무 예쁩니다.", user: "이영희" },
              { text: "음악이 영화의 분위기를 잘 살려주네요. 몰입감 최고!", user: "박민수" },
              { text: "배우들의 연기력이 대단합니다. 소름 돋았어요.", user: "최지우" },
              { text: "스토리가 탄탄해서 몰입감이 최고였어요. 끝까지 긴장되네요.", user: "강동원" },
              { text: "영상이 너무 아름다워요. 한 장면 한 장면이 예술이네요.", user: "한지민" },
              { text: "꼭 극장에서 봐야 할 영화네요. 스케일이 큽니다.", user: "정우성" },
              { text: "감동적인 메시지가 있는 영화입니다. 눈물 났어요.", user: "김혜수" },
              { text: "추천하고 싶은 명작입니다. 친구들에게 다 알려주려고요.", user: "이병헌" },
              { text: "보는 내내 긴장감을 놓칠 수 없었네요. 대박!", user: "손예진" },
              { text: "인생 영화 등극! 정말 오랜만에 좋은 영화 봤습니다.", user: "공유" },
              { text: "친구들에게 추천해야겠어요. 다들 좋아할 것 같아요.", user: "전지현" },
              { text: "감독님의 차기작이 기대됩니다. 벌써부터 기다려지네요.", user: "유재석" },
              { text: "여러 번 봐도 질리지 않을 것 같아요. 다시 보러 갑니다.", user: "김연아" },
              { text: "대사 하나하나가 주옥같네요. 가슴에 와닿습니다.", user: "봉준호" },
              { text: "작품성이 뛰어난 영화입니다. 예술 영화의 정수!", user: "송강호" },
              { text: "가슴이 뭉클해지는 영화였어요. 여운이 길게 남네요.", user: "조인성" },
              { text: "화려한 액션이 인상 깊네요. 눈이 즐거웠습니다.", user: "현빈" },
              { text: "철학적인 고민을 하게 만드는 영화입니다. 생각이 많아지네요.", user: "박보검" },
              { text: "완벽한 영화 그 자체입니다. 흠잡을 곳이 없어요.", user: "아이유" },
              { text: "심장이 멎는 듯한 긴장감... 정말 최고였습니다.", user: "김남길" },
              { text: "인간의 본성을 꿰뚫는 통찰력이 돋보이는 수작입니다.", user: "김윤석" },
              { text: "단순한 재미를 넘어 깊은 감동을 선사하네요.", user: "조승우" },
              { text: "이 영화는 두 번 봐야 합니다. 디테일이 살아있어요.", user: "하정우" },
              { text: "올해 최고의 발견! 감독님의 팬이 되었습니다.", user: "문소리" },
              { text: "배우들의 케미가 정말 환상적이네요.", user: "남주혁" },
              { text: "다시 봐도 소름 돋는 연출... 명작입니다.", user: "이지은" },
              { text: "이 영화 안 본 사람 없게 해주세요.", user: "김도연" },
              { text: "감독님의 예술적 감각이 폭발하는 작품!", user: "박찬욱" },
              { text: "스토리의 깊이가 남다릅니다.", user: "심은경" },
              { text: "배경 음악이 너무 좋아서 플레이리스트에 담았어요.", user: "이선균" },
              { text: "매 장면 캡처하고 싶을 정도로 예뻐요.", user: "김태리" },
              { text: "여운이 가시질 않아 잠을 못 이룰 것 같네요.", user: "박서준" },
              { text: "이런 영화가 더 많이 제작되었으면 좋겠습니다.", user: "류승룡" },
              { text: "감동과 재미, 두 마리 토끼를 다 잡았네요.", user: "조진웅" },
              { text: "진정한 영화란 이런 것임을 보여줍니다.", user: "정해인" },
              { text: "모든 것이 완벽한 균형을 이루고 있어요.", user: "김희애" },
              { text: "가슴 벅찬 감동을 느꼈습니다.", user: "박보영" },
              { text: "영화의 온도가 느껴지는 따뜻한 작품입니다.", user: "서강준" },
              { text: "긴 시간 동안의 작업이 빛을 발하네요.", user: "유아인" },
              { text: "현실의 고단함을 잊게 해주는 영화적 체험이었습니다.", user: "김수현" }
            ].map((comment, idx) => (
              <div key={idx} className="bg-zinc-800/80 border border-white/10 p-6 rounded-lg relative hover:bg-zinc-700/80 transition-colors cursor-default">
                <p className="font-bold text-zinc-100">{comment.text}</p>
                <span className="absolute bottom-4 right-6 text-xs font-bold text-zinc-500">{comment.user}</span>
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar (Sticky) */}
          <aside className="w-full lg:w-[400px] sticky top-8 space-y-12 self-start">
            {/* Director's Word */}
            <div className="bg-white/11 border border-white/10 p-8 rounded-lg space-y-6 hover:bg-white/15 transition-colors cursor-default group">
              <div className="inline-block bg-amber-500 px-4 py-1 rounded text-xs font-black text-black group-hover:bg-amber-400 transition-colors">
                감독의 한마디
              </div>
              <p className="text-sm font-bold text-zinc-300 leading-relaxed">
                작은 침묵 속에서도 마음은 계속 움직인다는 것을 보여주고 싶었습니다.
              </p>
            </div>

            {/* Ad Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-300 text-right uppercase tracking-tighter">
                  수익의 일부는 영화 제작 지원에 사용됩니다
                </p>
                <div className="bg-white/5 border border-white/10 aspect-[16/9] rounded-lg overflow-hidden hover:border-white/20 transition-colors">
                  <a href="https://thon.khlug.org" target="_blank" rel="noopener noreferrer">
                    <img src={adImage} alt="Advertisement 1" className="w-full h-full object-cover" />
                  </a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 aspect-[16/9] rounded-lg overflow-hidden hover:border-white/20 transition-colors">
                <a href="https://thon.khlug.org" target="_blank" rel="noopener noreferrer">
                  <img src={ad2Image} alt="Advertisement 2" className="w-full h-full object-cover" />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 3. Feedback Modal Overlay */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowFeedbackModal(false)}
          />
          <div className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-tight text-white">피드백 보내기</h2>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-zinc-500 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              감독님에게 따뜻한 응원의 메시지나 영화에 대한 소중한 피드백을 남겨주세요.
            </p>

            <textarea
              autoFocus
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="내용을 입력해주세요..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm min-h-[160px] outline-none focus:border-amber-500/50 transition-all resize-none mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-zinc-400 font-bold text-sm hover:bg-white/10 transition"
              >
                취소
              </button>
              <button
                disabled={!feedbackText.trim()}
                onClick={() => {
                  alert("피드백이 전송되었습니다!");
                  setFeedbackText("");
                  setShowFeedbackModal(false);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-amber-500 text-black font-black text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-amber-500/20"
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

