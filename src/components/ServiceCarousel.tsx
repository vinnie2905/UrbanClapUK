import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowRight, 
  Sparkles, 
  Utensils, 
  Scissors, 
  Activity, 
  Flame, 
  Wrench, 
  Paintbrush, 
  Flower, 
  Hammer, 
  Zap, 
  Tv 
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface CarouselSlide {
  category: ServiceCategory;
  title: string;
  tagline: string;
  desc: string;
  icon: React.ReactNode;
  image: string;
}

interface ServiceCarouselProps {
  onSelectCategory: (category: ServiceCategory) => void;
  activeTheme?: string;
}

export default function ServiceCarousel({ onSelectCategory, activeTheme = 'indigo' }: ServiceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: CarouselSlide[] = [
    {
      category: 'cooking',
      title: 'Daily Cooking',
      tagline: 'Traditional Homestyle Indian Meals Crafted in Your Kitchen',
      desc: 'Savor freshly cooked vegetarian, Gujarati, South Indian, Punjabi, and pure Jain meals. Our DBS-vetted home cooks handle everything from spice pairing to cleanup, bringing true Indian hospitality to your UK home.',
      icon: <Utensils className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'women_salon',
      title: 'Women Salon & Beauty',
      tagline: 'Exquisite Salon & Festive Styling in the Comfort of Home',
      desc: 'Transform your look with luxury blowouts, traditional Ayurvedic herbal facials, waxing, and flawless festive makeup. Highly trained female stylists bring high-end sanitised equipment directly to you.',
      icon: <Scissors className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'spa_beauty',
      title: 'SPA & Massage',
      tagline: 'Rejuvenating Home Spa Sessions to Melt Away Stress',
      desc: 'Experience the ultimate relaxation with certified therapists offering custom Swedish, deep tissue, and Indian head massages. Turn any room in your house into a peaceful, aromatic wellness sanctuary.',
      icon: <Activity className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'cleaning',
      title: 'Bathroom & Kitchen Deep Clean',
      tagline: 'Immaculate Deep Scrubbing & Grease Descaling',
      desc: 'Combat tough grease, deep grime, and hard water lime scales in your kitchen and washrooms. Our meticulous professionals use premium cleaning agents to restore flawless shine and absolute sanitation.',
      icon: <Flame className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'plumbing',
      title: 'Plumbing Works',
      tagline: 'Rapid-Response Leak Fixing & Appliance Installations',
      desc: 'Resolve water emergencies, leaky pipes, tap faults, and clogged sinks. Our vetted local plumbers ensure high-quality, long-lasting fixes and professional appliance installations.',
      icon: <Wrench className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'painting',
      title: 'Painting & Sanding',
      tagline: 'Transform Your Home with Professional Accent Walls',
      desc: 'Refresh your living spaces with precision sanding, flawless plaster filling, and double-coat protective paints. Get flawless, beautiful finishes customized precisely to your interior mood.',
      icon: <Paintbrush className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'gardening',
      title: 'Gardening & Lawns',
      tagline: 'Pristine Outdoor Spaces with Regular Lawn Grooming',
      desc: 'Keep your garden in peak condition with detailed lawn mowing, hedge trimming, plant pruning, and weed management. Professional gardeners bring specialized tools to shape your perfect green oasis.',
      icon: <Flower className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'carpenter',
      title: 'Carpentry Assembly',
      tagline: 'Expert Furniture Assembly & Custom Woodworking Repairs',
      desc: 'Overcome flatpack assembly frustrations. Our experienced carpenters align door hinges, secure wobbly drawers, fix custom cabinets, and mount wall shelves with absolute structural precision.',
      icon: <Hammer className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'electrical_fitting',
      title: 'Electrical Fittings',
      tagline: 'BS7671 Certified Electrical Installations & Upgrades',
      desc: 'From installing safe new USB wall sockets and luxury light pendants to minor fault diagnosis, secure your electrical system with qualified, certified electricians adhering to British Standards.',
      icon: <Zap className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80'
    },
    {
      category: 'appliance_repair',
      title: 'Appliance Repairs',
      tagline: 'Speedy Diagnostics & Repairs for Essential Appliances',
      desc: 'Ensure your home runs smoothly with rapid troubleshooting for washing machines, tumble dryers, dishwashers, and refrigerators. Our expert technicians carry high-grade replacement parts.',
      icon: <Tv className="h-6 w-6" />,
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Theme based color helpers
  const getThemeColorClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'from-emerald-600 to-amber-600 hover:from-emerald-700 hover:to-amber-700 bg-emerald-600 focus:ring-emerald-500';
      case 'crimson': return 'from-pink-600 to-rose-700 hover:from-pink-700 hover:to-rose-800 bg-pink-600 focus:ring-pink-500';
      case 'lavender': return 'from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 bg-teal-600 focus:ring-teal-500';
      case 'terracotta': return 'from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 bg-orange-500 focus:ring-orange-500';
      default: return 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 bg-indigo-600 focus:ring-indigo-500';
    }
  };

  const getThemeTextClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'text-emerald-400';
      case 'crimson': return 'text-pink-400';
      case 'lavender': return 'text-teal-400';
      case 'terracotta': return 'text-orange-400';
      default: return 'text-indigo-400';
    }
  };

  const getThemeBgClass = () => {
    switch (activeTheme) {
      case 'emerald': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'crimson': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'lavender': return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'terracotta': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative" 
      id="services-carousel-section"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="relative h-[480px] sm:h-[440px] md:h-[380px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100/10">
        
        {/* Slides rendering */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.category}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out flex flex-col md:flex-row ${
                isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-12 pointer-events-none z-0'
              }`}
              id={`slide-${slide.category}`}
            >
              {/* Background Image Panel (Left/Top on mobile) */}
              <div className="w-full md:w-1/2 h-44 sm:h-52 md:h-full relative overflow-hidden shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover transition-transform duration-10000 ease-linear ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                />
                {/* Visual Accent Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
                
                {/* Floating Service Badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" /> VETTED SERVICE
                  </span>
                </div>
              </div>

              {/* Text Information Panel (Right/Bottom) */}
              <div className="w-full md:w-1/2 bg-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between h-full relative border-t md:border-t-0 md:border-l border-white/5">
                {/* Radial gradient backing for premium depth */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-slate-950/0 to-slate-950 pointer-events-none"></div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${getThemeBgClass()}`}>
                      {slide.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${getThemeTextClass()}`}>
                      {slide.title}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-white max-w-lg">
                      {slide.tagline}
                    </h2>
                    <p className="text-xs sm:text-xs text-slate-300 leading-relaxed max-w-xl font-medium">
                      {slide.desc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5 relative z-10 shrink-0">
                  {/* Action Button */}
                  <button
                    onClick={() => {
                      onSelectCategory(slide.category);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`inline-flex items-center justify-center gap-2 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-lg bg-gradient-to-r ${getThemeColorClass()}`}
                    id={`book-btn-${slide.category}`}
                  >
                    <span>Instant Booking</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Playback Controls & Counter */}
                  <div className="flex items-center justify-between sm:justify-end gap-3.5">
                    {/* Page counter indicator */}
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">
                      {String(index + 1).padStart(2, '0')} <span className="text-slate-600">/</span> {String(slides.length).padStart(2, '0')}
                    </span>

                    {/* Controls */}
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-lg">
                      <button
                        onClick={handlePrev}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
                        title="Previous Slide"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
                        title={isPlaying ? 'Pause Autoplay' : 'Play Autoplay'}
                      >
                        {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
                      </button>

                      <button
                        onClick={handleNext}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-all cursor-pointer"
                        title="Next Slide"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Slide dots selector overlay below the banner */}
      <div className="flex justify-center gap-1.5 mt-3.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex 
                ? `w-6 ${activeTheme === 'emerald' ? 'bg-emerald-600' : activeTheme === 'crimson' ? 'bg-pink-600' : activeTheme === 'lavender' ? 'bg-teal-600' : activeTheme === 'terracotta' ? 'bg-orange-500' : 'bg-indigo-600'}` 
                : 'w-1.5 bg-gray-200 hover:bg-gray-300'
            }`}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
