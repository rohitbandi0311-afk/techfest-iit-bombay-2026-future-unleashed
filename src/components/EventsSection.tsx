import React, { useState } from 'react';
import { TECHFEST_EVENTS } from '../data/techfestData';
import { TechfestEvent, EventCategory } from '../types/techfest';
import { soundFx } from '../services/soundFx';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface EventsSectionProps {
  onSelectEvent: (event: TechfestEvent) => void;
  onRegisterEvent: (event: TechfestEvent) => void;
  selectedDomainFilter?: string | null;
  onClearDomainFilter?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onSelectEvent,
  onRegisterEvent,
  selectedDomainFilter = null,
  onClearDomainFilter,
}) => {
  const [activeCategory, setActiveCategory] = useState<EventCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = TECHFEST_EVENTS.filter((evt) => {
    const matchesCategory = activeCategory === 'all' || evt.category === activeCategory;
    const matchesDomain = !selectedDomainFilter || evt.domainId === selectedDomainFilter;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDomain && matchesSearch;
  });

  const categories: { id: EventCategory; label: string }[] = [
    { id: 'all', label: 'All Arenas' },
    { id: 'flagship', label: 'Flagship Combats' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'technoholix', label: 'Technoholix Nights' },
  ];

  return (
    <section id="events" className="relative py-20 lg:py-28 bg-[#030712] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 gsap-header">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/30 text-orange-400 text-xs font-rajdhani font-semibold mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>THE BATTLEGROUND OF TITANS</span>
            </div>
            <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase">
              TECHFEST <span className="text-orange-400 text-glow-orange">EVENTS</span> & ARENAS
            </h2>
            <p className="text-slate-400 font-space text-sm sm:text-base mt-2 max-w-xl">
              From titanium-shredding 60kg Robowars to 48-hour algorithmic hackathons and aerial drone
              orchestrations.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search competitions, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Active Domain Filter Alert if selected */}
        {selectedDomainFilter && (
          <div className="mb-6 p-3 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-rajdhani font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>
                FILTERED BY DOMAIN ARENA: <span className="font-bold text-white uppercase">{selectedDomainFilter}</span>
              </span>
            </div>
            {onClearDomainFilter && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onClearDomainFilter();
                }}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/50 text-cyan-300 hover:text-white hover:bg-cyan-900 font-mono text-[11px] transition-colors cursor-pointer"
              >
                CLEAR FILTER [X]
              </button>
            )}
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-rajdhani font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-3xl bg-[#020617] border border-slate-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <div>
                {/* Header inside card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900 text-cyan-400 border border-cyan-500/30">
                    {event.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-950 text-orange-400 border border-orange-500/20">
                    {event.status}
                  </span>
                </div>

                <h3 className="font-orbitron text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {event.title}
                </h3>
                <p className="text-xs font-rajdhani font-semibold text-slate-400 mb-4 line-clamp-1">
                  {event.tagline}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Key specs */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs mb-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span className="font-orbitron font-bold text-yellow-400">{event.prize}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{event.teamSize}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onSelectEvent(event);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-rajdhani font-bold border border-slate-700 transition-colors cursor-pointer text-center"
                >
                  VIEW SPECS
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onRegisterEvent(event);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-rajdhani font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>REGISTER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
