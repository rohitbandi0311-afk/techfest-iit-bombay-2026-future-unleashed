import React from 'react';
import { About3DGateway } from './canvas/About3DGateway';
import { TECHFEST_META } from '../data/techfestData';
import { Award, Target, Flame, Lightbulb, Users2, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-20 lg:py-28 bg-[#030712] overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GENESIS OF ASIA’S LARGEST TECH SUMMIT</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase">
            ABOUT <span className="text-glow-cyan text-cyan-400">TECHFEST</span> IIT BOMBAY
          </h2>
          <p className="text-slate-400 font-space text-sm sm:text-base mt-4 leading-relaxed">
            Inception in 1998 with a vision to catalyze raw curiosity into engineering reality.
            Today, Techfest stands as the definitive global crossroads where visionary minds redefine
            the boundary between science and human ambition.
          </p>
        </div>

        {/* 2-Column Split: Animated 3D Gateway & Rich Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Left Column: 3D Animated Technology Object */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full relative rounded-3xl bg-gradient-to-b from-slate-900/60 to-[#020617] border border-cyan-500/30 p-2 sm:p-4 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              {/* Corner Sci-Fi Accents */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              <About3DGateway />

              <div className="text-center pb-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                  QUANTUM NEXUS GATEWAY • ACTIVE TELEMETRY
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Narrative & Heritage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="cyber-panel p-6 sm:p-8 rounded-3xl">
              <h3 className="font-orbitron text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <Flame className="w-6 h-6 text-orange-400 shrink-0" />
                <span>The Crucible of 29 Editions of Innovation</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Over nearly three decades, Techfest has grown from a grassroots campus endeavor into
                an international technological titan. Operating under the esteemed patronage of
                organizations such as UNESCO and UNICEF, Techfest provides an unapologetic arena for
                cutting-edge autonomous robotics, breakthrough AI models, and aerospace engineering.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every winter, 175,000+ engineers, creators, startup founders, and researchers converge
                on the 550-acre Powai campus, transforming IIT Bombay into the world’s most energetic
                proving ground for what comes next.
              </p>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Award className="w-5 h-5 text-yellow-400 mb-2" />
                <div className="font-orbitron text-sm font-bold text-white">Global Prestige</div>
                <div className="text-xs text-slate-400 mt-1">
                  Endorsed by international scientific councils and Nobel Laureates.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Target className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="font-orbitron text-sm font-bold text-white">Zero Compromise</div>
                <div className="text-xs text-slate-400 mt-1">
                  Harsh combat arenas and battle-tested competitive benchmarks.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Lightbulb className="w-5 h-5 text-orange-400 mb-2" />
                <div className="font-orbitron text-sm font-bold text-white">Open Frontier</div>
                <div className="text-xs text-slate-400 mt-1">
                  Unlocking patents, student incubators, and cross-border teams.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll-Triggered Impact Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {TECHFEST_META.stats.map((stat, idx) => (
            <div
              key={idx}
              className="gsap-stat-card p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400 transition-colors text-center shadow-lg"
            >
              <div className="font-orbitron text-2xl sm:text-3xl font-black text-cyan-400 text-glow-cyan mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-rajdhani font-bold text-white uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
