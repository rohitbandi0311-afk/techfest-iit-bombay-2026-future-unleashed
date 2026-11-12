import React from 'react';
import { Hero3DCanvas } from './canvas/Hero3DCanvas';
import { soundFx } from '../services/soundFx';
import {
  ArrowDown,
  Sparkles,
  Zap,
  Globe2,
  Calendar,
  MapPin,
  Trophy,
} from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenPass: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onOpenPass }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-between overflow-hidden cyber-grid"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Hero Content Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4 sm:pt-6">
        {/* Edition Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orbitron text-xs sm:text-sm font-bold text-cyan-300 tracking-wider">
            TECHFEST IIT BOMBAY 2026
          </span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-xs text-orange-400 font-semibold">29TH EDITION</span>
        </div>

        {/* HUGE FUTURE UNLEASHED TYPOGRAPHY */}
        <div className="space-y-1 sm:space-y-2 mb-4">
          <h1 className="font-orbitron text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase select-none">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(255,255,255,0.15)]">
              FUTURE
            </span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 bg-clip-text text-transparent text-glow-cyan">
              UNLEASHED
            </span>
          </h1>
        </div>

        {/* Tagline / Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300 font-space text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-6">
          Asia’s Largest Science & Technology Festival. Witness the monumental convergence of
          Artificial Intelligence, Heavyweight RoboWars, Deep Space Telemetry, and Quantum Synthesis.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onExplore();
            }}
            className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-rajdhani font-bold text-base sm:text-lg tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] flex items-center gap-2 cursor-pointer"
          >
            <span>EXPLORE TECHFEST</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenPass();
            }}
            className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 font-rajdhani font-bold text-base sm:text-lg tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>CLAIM CYBER PASS</span>
          </button>
        </div>
      </div>

      {/* 3D Interactive Centerpiece Canvas */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 -mt-4 sm:-mt-8">
        <Hero3DCanvas />
      </div>

      {/* Bottom Live Metrics Ticker Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-[#030712]/90 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">
                Festival Dates
              </div>
              <div className="font-rajdhani font-bold text-sm sm:text-base text-white">
                Dec 26 – 28, 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-950/80 border border-orange-500/30 text-orange-400">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">
                Campus Arena
              </div>
              <div className="font-rajdhani font-bold text-sm sm:text-base text-white">
                IIT Bombay, Mumbai
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">
                Prize Pool
              </div>
              <div className="font-orbitron font-bold text-sm sm:text-base text-yellow-400">
                ₹50,00,000+
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400">
              <Globe2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase">
                Patronage
              </div>
              <div className="font-rajdhani font-bold text-sm sm:text-base text-cyan-300">
                UNESCO & UNICEF
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
