import React from 'react';
import { TechfestEvent } from '../types/techfest';
import { soundFx } from '../services/soundFx';
import {
  X,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  Mail,
  Shield,
} from 'lucide-react';

interface EventDetailModalProps {
  event: TechfestEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (event: TechfestEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#030712] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-orange-500 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {event.category.toUpperCase()}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-orange-950 text-orange-400 border border-orange-500/30">
              STATUS: {event.status}
            </span>
          </div>

          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white">
            {event.title}
          </h2>
          <p className="text-cyan-400 font-rajdhani font-semibold text-base mt-1">
            {event.tagline}
          </p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>Prize Pool</span>
            </div>
            <div className="font-orbitron text-base font-bold text-yellow-400">{event.prize}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Team Size</span>
            </div>
            <div className="font-rajdhani text-sm font-semibold text-white">{event.teamSize}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>Dates</span>
            </div>
            <div className="font-rajdhani text-sm font-semibold text-white">{event.date}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Timing</span>
            </div>
            <div className="font-rajdhani text-sm font-semibold text-white">{event.time}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-rajdhani text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
            Overview & Scope
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
        </div>

        {/* Rules & Guidelines */}
        <div className="mb-6">
          <h4 className="font-rajdhani text-xs uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Key Competition Directives & Rules</span>
          </h4>
          <ul className="space-y-2">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Venue & Coordinator Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 mb-6">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-slate-300 font-semibold">Arena Venue</div>
              <div>{event.venue}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-slate-300 font-semibold">Lead Coordinator</div>
              <div>
                {event.coordinator.name} ({event.coordinator.contact})
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onRegister(event);
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-rajdhani font-bold text-base rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>REGISTER TEAM FOR EVENT</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-rajdhani font-semibold text-sm transition-colors"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};
