import React from 'react';
import { Interactive3DLab } from './canvas/Interactive3DLab';
import { Sparkles, Eye, Sliders, Box, Layers, Zap } from 'lucide-react';

export const Experience3DLabSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-20 lg:py-28 bg-[#020617] cyber-grid overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 gsap-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE REAL-TIME 3D SIMULATOR</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide uppercase">
            3D HOLO-DECK <span className="text-cyan-400 text-glow-cyan">EXPERIENCE</span>
          </h2>
          <p className="text-slate-400 font-space text-sm sm:text-base mt-4 leading-relaxed">
            Manipulate authentic procedural hardware models in real time. Decompose assemblies with
            exploded-view sliders, modify studio lighting rigs, and switch camera vantage points.
          </p>
        </div>

        {/* 3D Lab Component Mount */}
        <div className="mb-12">
          <Interactive3DLab />
        </div>

        {/* Interactive Features Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Box className="w-6 h-6 text-cyan-400 mb-3" />
            <div className="font-orbitron text-sm font-bold text-white mb-1">
              Procedural Models
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Synthesized purely via mathematical geometry routines with zero external GLB
              dependencies.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Layers className="w-6 h-6 text-orange-400 mb-3" />
            <div className="font-orbitron text-sm font-bold text-white mb-1">
              Exploded Kinematics
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Inspect hidden subsystems and internal conduits with smooth continuous radial
              displacement.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Sliders className="w-6 h-6 text-emerald-400 mb-3" />
            <div className="font-orbitron text-sm font-bold text-white mb-1">
              PBR Studio Rigs
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Multi-point directional lighting paired with RoomEnvironment reflection mapping and ACES
              tone curve.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Eye className="w-6 h-6 text-purple-400 mb-3" />
            <div className="font-orbitron text-sm font-bold text-white mb-1">
              Zen Cinema Mode
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              Collapse the interactive dock to inspect pure 3D art unobstructed across full
              viewport resolution.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
