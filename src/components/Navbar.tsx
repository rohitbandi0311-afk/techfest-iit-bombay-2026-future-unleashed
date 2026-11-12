import React, { useState, useEffect } from 'react';
import { soundFx } from '../services/soundFx';
import { Volume2, VolumeX, Menu, X, Shield, Sparkles, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenPassModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPassModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Countdown timer to Dec 26, 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Target: Dec 26, 2026 09:00:00 IST
    const targetDate = new Date('2026-12-26T09:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#030712]/90 border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <span className="font-orbitron font-extrabold text-cyan-400 text-sm">TF</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-black tracking-wider text-base sm:text-lg text-white">
                  TECHFEST
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-400/50 text-[10px] font-mono text-cyan-300">
                  2026
                </span>
              </div>
              <div className="text-[10px] font-rajdhani tracking-widest text-slate-400 uppercase -mt-0.5">
                IIT BOMBAY • 29TH EDITION
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-rajdhani font-semibold tracking-wider text-slate-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              CORE
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              ABOUT
            </button>
            <button
              onClick={() => handleNavClick('domains')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              DOMAINS
            </button>
            <button
              onClick={() => handleNavClick('events')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              EVENTS
            </button>
            <button
              onClick={() => handleNavClick('experience')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              3D LAB
            </button>
            <button
              onClick={() => handleNavClick('speakers')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              SPEAKERS
            </button>
            <button
              onClick={() => handleNavClick('footer')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              CAMPUS
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Countdown Pills */}
            <div className="hidden xl:flex items-center gap-1.5 bg-[#030712] border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="text-slate-500 text-[10px]">T-MINUS</span>
              <span className="text-cyan-400 font-bold">{timeLeft.days}D</span>
              <span className="text-slate-600">:</span>
              <span className="text-white font-bold">{timeLeft.hours}H</span>
              <span className="text-slate-600">:</span>
              <span className="text-orange-400 font-bold">{timeLeft.minutes}M</span>
            </div>

            {/* Sound Synthesizer Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              }`}
              title={isMuted ? 'Turn Sound FX ON' : 'Turn Sound FX OFF'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Pass CTA Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenPassModal();
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-rajdhani font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_18px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>GET CYBER PASS</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#030712]/95 backdrop-blur-md pt-24 px-6 lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-4 text-lg font-rajdhani font-bold tracking-wider text-slate-200">
            {[
              { id: 'hero', label: '01 // FUTURE UNLEASHED CORE' },
              { id: 'about', label: '02 // ABOUT TECHFEST' },
              { id: 'domains', label: '03 // TECHNOLOGY DOMAINS' },
              { id: 'events', label: '04 // COMPETITIONS & EVENTS' },
              { id: 'experience', label: '05 // 3D HOLO-DECK LAB' },
              { id: 'speakers', label: '06 // KEYNOTE CONVOCATION' },
              { id: 'footer', label: '07 // CAMPUS & CONTACT' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center justify-between py-3 border-b border-slate-800 text-left hover:text-cyan-400"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            ))}

            <div className="pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPassModal();
                }}
                className="w-full py-3.5 bg-cyan-500 text-black font-rajdhani font-bold text-center rounded-xl"
              >
                REGISTER CYBER PASS 2026
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
