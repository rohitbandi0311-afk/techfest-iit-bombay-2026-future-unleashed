import React from 'react';
import { KEYNOTE_SPEAKERS } from '../data/techfestData';
import { Sparkles, Calendar, Clock, MapPin, Mic, Award } from 'lucide-react';

export const SpeakersSection: React.FC = () => {
  return (
    <section id="speakers" className="relative py-20 lg:py-28 bg-[#030712] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 gsap-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-rajdhani font-semibold mb-3">
            <Mic className="w-3.5 h-3.5" />
            <span>GLOBAL KEYNOTE CONVOCATION</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase">
            VISIONARY <span className="text-purple-400 text-glow-blue">THINKERS</span>
          </h2>
          <p className="text-slate-400 font-space text-sm sm:text-base mt-4 leading-relaxed">
            Direct dialogue with leaders reshaping planetary frontiers. In-person lectures in the
            historic Convocation Hall, IIT Bombay.
          </p>
        </div>

        {/* Speakers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {KEYNOTE_SPEAKERS.map((speaker) => (
            <div
              key={speaker.id}
              className="group relative rounded-3xl bg-[#020617] border border-slate-800 hover:border-purple-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              <div>
                {/* Speaker Avatar / Badge simulation */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/30">
                    {speaker.badge}
                  </span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-600 p-[1px] mb-4 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center font-orbitron font-extrabold text-xl text-purple-300">
                    {speaker.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>

                <h3 className="font-orbitron text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {speaker.name}
                </h3>
                <div className="text-xs font-rajdhani font-bold text-cyan-400 mt-0.5">
                  {speaker.title}
                </div>
                <div className="text-xs text-slate-400 font-mono mb-4">{speaker.organization}</div>

                {/* Keynote Topic */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 mb-4">
                  <div className="text-[10px] font-mono text-purple-400 uppercase mb-1">
                    Keynote Address
                  </div>
                  <div className="font-semibold italic">"{speaker.topic}"</div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  <span>
                    {speaker.date} • {speaker.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{speaker.venue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
