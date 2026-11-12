import React, { useState } from 'react';
import { soundFx } from '../services/soundFx';
import {
  ArrowUp,
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  onOpenPass: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPass }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundFx.playClick();
    setSubscribed(true);
    setTimeout(() => {
      soundFx.playSuccess();
    }, 200);
  };

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="relative bg-[#020617] border-t border-cyan-500/20 pt-16 pb-12 overflow-hidden">
      {/* Top glow divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Column 1: Techfest Brand & Theme */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px]">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-orbitron font-extrabold text-cyan-400 text-sm">
                  TF
                </div>
              </div>
              <div>
                <div className="font-orbitron font-black text-lg text-white">
                  TECHFEST IIT BOMBAY
                </div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                  29TH EDITION • 2026
                </div>
              </div>
            </div>

            <div className="font-orbitron text-2xl font-black bg-gradient-to-r from-white via-cyan-300 to-orange-400 bg-clip-text text-transparent">
              FUTURE UNLEASHED
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Asia’s Largest Science and Technology Festival. Catalyzing technological inquiry,
              international scientific cooperation, and extreme mechatronic engineering.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                PATRONAGE: UNESCO
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                UNICEF
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-orbitron text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs font-rajdhani font-semibold text-slate-400">
              {['Hero Core', 'About Legacy', 'Tech Domains', 'Flagship Events', '3D Holo-Deck', 'Convocation Speakers'].map(
                (link, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        const targetId = ['hero', 'about', 'domains', 'events', 'experience', 'speakers'][idx];
                        const el = document.getElementById(targetId);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        soundFx.playClick();
                      }}
                      className="hover:text-cyan-400 transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Campus & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <div className="font-orbitron text-xs font-bold text-white uppercase tracking-wider">
              IIT Bombay Campus
            </div>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>
                  Students' Activity Centre (SAC), IIT Bombay, Powai, Mumbai, Maharashtra 400076,
                  India
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 pl-6">
                GPS: 19.1334° N, 72.9133° E
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>support@techfest.org</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 22 2576 4040</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter & Pass CTA */}
          <div className="lg:col-span-3 space-y-4">
            <div className="font-orbitron text-xs font-bold text-white uppercase tracking-wider">
              Festival Dispatch
            </div>
            <p className="text-xs text-slate-400">
              Receive confidential problem statements, rulebook updates, and arena schedules.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter engineering email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>SUBSCRIBED TO 2026 DISPATCH</span>
              </div>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenPass();
              }}
              className="w-full py-2.5 rounded-xl bg-cyan-950 border border-cyan-400/50 hover:bg-cyan-900 text-cyan-300 font-rajdhani font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>CLAIM ATTENDEE CYBER PASS</span>
            </button>
          </div>
        </div>

        {/* Bottom Social Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 TECHFEST, IIT BOMBAY. All rights reserved. Built with Three.js & Modern WebGL.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
            <a
              href="https://www.instagram.com/techfest_iitbombay"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/techfest"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/Techfest_IITB"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              X / Twitter
            </a>
            <a
              href="https://www.youtube.com/user/techfestiitbombay"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              YouTube
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
            title="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono">TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
