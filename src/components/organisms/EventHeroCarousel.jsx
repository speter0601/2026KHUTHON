import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { events } from "../../data/events";
import { movies } from "../../data/movies";

/**
 * EventHeroCarousel Component
 * Displays MOV:ON platform events in a cinematic carousel.
 * Restores original homepage banner proportions and structure.
 */
const EventHeroCarousel = ({ onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % events.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

  // Recommendations (Original side card content)
  const sideMovie1 = movies.length > 0 ? movies[0] : null;
  const sideMovie2 = movies.length > 1 ? movies[1] : null;

  return (
    <section className="mx-auto mt-8 grid max-w-7xl grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 px-8">
      {/* Main Event Carousel */}
      <div className="relative group h-[520px] overflow-hidden rounded-[2.5rem] bg-zinc-950 shadow-2xl border border-white/5">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={event.image}
              alt={event.title}
              className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
                index === currentIndex ? "scale-110" : "scale-100"
              }`}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80";
              }}
            />
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 p-12 flex flex-col justify-end max-w-2xl space-y-6">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                  event.accent === 'amber' ? 'bg-amber-500 text-black' : 'bg-orange-600 text-white'
                }`}>
                  {event.type}
                </span>
                <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em]">
                  {event.subtitle}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">
                  {event.title}
                </h1>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-lg">
                  {event.description}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-4">
                 <button className="px-10 py-4 bg-white text-black rounded-2xl font-black text-sm hover:bg-amber-500 transition-all shadow-2xl active:scale-95 group/btn">
                    {event.ctaLabel}
                 </button>
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">상태</span>
                    <span className="text-xs font-black text-amber-500/80">{event.date}</span>
                 </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-12 right-12 z-20 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition">←</button>
          <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition">→</button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {events.map((_, index) => (
            <div key={index} className={`h-1 rounded-full transition-all duration-500 ${index === currentIndex ? "w-8 bg-amber-500" : "w-1.5 bg-white/20"}`} />
          ))}
        </div>
      </div>

      {/* Side Recommendations (Restoring original structure) */}
      <div className="grid gap-6">
        {sideMovie1 && (
          <HeroSideCard
            movie={sideMovie1}
            badge="MOST LOVED"
            onClick={onMovieClick}
          />
        )}
        {sideMovie2 && (
          <HeroSideCard
            movie={sideMovie2}
            badge="EDITOR'S PICK"
            onClick={onMovieClick}
          />
        )}
      </div>
    </section>
  );
};

const HeroSideCard = ({ movie, badge, onClick }) => {
  if (!movie) return null;
  const cardImage = movie?.posterImage || movie?.stillImage || "";

  return (
    <div 
      onClick={() => onClick(movie)}
      className="relative h-[247px] group overflow-hidden rounded-[2rem] bg-zinc-900 shadow-xl cursor-pointer block border border-white/5"
    >
      {cardImage && (
        <img src={cardImage} alt={movie?.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      <div className="absolute bottom-6 left-6 space-y-1.5">
        <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-black tracking-widest rounded mb-2 inline-block uppercase shadow-lg">{badge}</span>
        <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-amber-200 transition-colors">
          {movie?.title}
        </h2>
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{movie?.genres?.[0]} • {movie?.director} 감독</p>
      </div>
    </div>
  );
};

export default EventHeroCarousel;
