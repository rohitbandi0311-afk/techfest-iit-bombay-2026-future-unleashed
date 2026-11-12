import React, { useState } from 'react';
import { TECH_DOMAINS } from '../data/techfestData';
import { Domain3DViewer } from './canvas/Domain3DViewer';
import { TechDomain } from '../types/techfest';
import { soundFx } from '../services/soundFx';
import { ArrowUpRight, Cpu, Bot, Rocket, Atom, Terminal, Trophy, ChevronRight } from 'lucide-react';

interface DomainsSectionProps {
  onSelectDomain: (domain: TechDomain) => void;
}

export const DomainsSection: React.FC<DomainsSectionProps> = ({ onSelectDomain }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-orange-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-sky-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
      default:
        return <Terminal className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="domains" className="relative py-20 lg:py-28 bg-[#020617] cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>CORE PILLARS OF FUTURE UNLEASHED</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase">
            TECHNOLOGY <span className="text-cyan-400 text-glow-cyan">DOMAINS</span>
          </h2>
          <p className="text-slate-400 font-space text-sm sm:text-base mt-4 leading-relaxed">
            Immerse yourself in 5 specialized tech sectors. Each card features an interactive 3D
            procedural module. Hover and rotate to inspect cutting-edge hardware.
          </p>
        </div>

        {/* 3D Interactive Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TECH_DOMAINS.map((domain) => {
            const isHovered = hoveredCard === domain.id;

            return (
              <div
                key={domain.id}
                onMouseEnter={() => {
                  setHoveredCard(domain.id);
                  soundFx.playHover();
                }}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative rounded-3xl bg-[#030712]/95 border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl"
                style={{
                  borderColor: isHovered ? domain.accentColor : 'rgba(30, 41, 59, 0.8)',
                  boxShadow: isHovered
                    ? `0 0 30px -5px ${domain.accentColor}40`
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Top Header inside Card */}
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider"
                      style={{
                        backgroundColor: `${domain.accentColor}15`,
                        color: domain.accentColor,
                        border: `1px solid ${domain.accentColor}40`,
                      }}
                    >
                      {domain.tag}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {getDomainIcon(domain.iconName)}
                    </div>
                  </div>

                  <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {domain.title}
                  </h3>
                  <p className="text-xs font-rajdhani font-semibold text-slate-400 mt-1">
                    {domain.subtitle}
                  </p>
                </div>

                {/* Interactive 3D Canvas Viewport */}
                <div className="relative px-4 py-1">
                  <Domain3DViewer
                    modelType={domain.modelType}
                    accentColor={domain.accentColor}
                    isHovered={isHovered}
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-slate-300">
                      INTERACTIVE 3D
                    </span>
                  </div>
                </div>

                {/* Description & Competitions preview */}
                <div className="p-6 pt-2 space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {domain.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {domain.highlights.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Featured Competition Banner */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        Flagship Trophy
                      </div>
                      <div className="text-xs font-bold text-white truncate max-w-[160px]">
                        {domain.featuredCompetition}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Prize Pool</div>
                      <div className="text-xs font-orbitron font-bold text-yellow-400">
                        {domain.prizePool}
                      </div>
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectDomain(domain);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 text-slate-300 hover:text-black font-rajdhani font-bold text-sm tracking-wider border border-slate-800 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ENTER DOMAIN ARENA</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
