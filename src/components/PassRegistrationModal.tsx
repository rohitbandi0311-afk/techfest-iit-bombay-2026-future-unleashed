import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundFx';
import { GeneratedCyberPass } from '../types/techfest';
import { downloadCyberPassImage } from '../services/passGenerator';
import { X, CheckCircle, ShieldCheck, Download, Copy, Sparkles, QrCode, Printer } from 'lucide-react';

interface PassRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

export const PassRegistrationModal: React.FC<PassRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultDomain = 'Artificial Intelligence',
}) => {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    institution: string;
    city: string;
    domainInterest: string;
    attendeeType: 'Student' | 'Professional' | 'International Participant' | 'Faculty';
  }>({
    fullName: '',
    email: '',
    institution: '',
    city: 'Mumbai',
    domainInterest: defaultDomain,
    attendeeType: 'Student',
  });

  const [generatedPass, setGeneratedPass] = useState<GeneratedCyberPass | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.institution) return;

    setIsSubmitting(true);
    soundFx.playClick();

    setTimeout(() => {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const prefix = formData.domainInterest.slice(0, 3).toUpperCase();
      const passId = `TF26-${prefix}-${randomDigits}`;

      const newPass: GeneratedCyberPass = {
        ...formData,
        passId,
        issuedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        qrCodeSeed: `TECHFEST_IITB_2026_${passId}_VALID`,
        accessTier: formData.attendeeType === 'Student' ? 'STANDARD DELEGATE' : 'ALL-ACCESS VIP',
        zoneCode: `ZONE-${Math.floor(1 + Math.random() * 5)}`,
      };

      setGeneratedPass(newPass);
      setIsSubmitting(false);
      soundFx.playSuccess();

      // Launch Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#f97316', '#3b82f6', '#10b981'],
        });
      } catch {}
    }, 600);
  };

  const handleCopyId = () => {
    if (generatedPass) {
      navigator.clipboard.writeText(generatedPass.passId);
      setCopied(true);
      soundFx.playClick();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#030712] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Futuristic top bar accent */}
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

        {!generatedPass ? (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-rajdhani font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL FESTIVAL ACCREDITATION</span>
              </div>
              <h3 className="font-orbitron text-2xl md:text-3xl font-extrabold text-white">
                GET TECHFEST 2026 PASS
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Access 50+ competitions, international exhibits, keynote arenas, and Technoholix nights.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-rajdhani uppercase font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-rajdhani uppercase font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aryan@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-rajdhani uppercase font-semibold text-slate-300 mb-1">
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Bombay / BITS"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-rajdhani uppercase font-semibold text-slate-300 mb-1">
                    Primary Domain Focus
                  </label>
                  <select
                    value={formData.domainInterest}
                    onChange={(e) => setFormData({ ...formData, domainInterest: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Robotics & Automation">Robotics & Automation</option>
                    <option value="Space Technology">Space Technology</option>
                    <option value="Innovation & CleanTech">Innovation & CleanTech</option>
                    <option value="Coding & Cybersecurity">Coding & Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-rajdhani uppercase font-semibold text-slate-300 mb-1">
                    Delegate Type
                  </label>
                  <select
                    value={formData.attendeeType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        attendeeType: e.target.value as 'Student' | 'Professional' | 'International Participant' | 'Faculty',
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors text-sm"
                  >
                    <option value="Student">Student Delegate (Free Pass)</option>
                    <option value="Professional">Professional / Industry Innovator</option>
                    <option value="International Participant">International Participant</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-rajdhani font-bold text-base rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>GENERATING QUANTUM HASH...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>CLAIM YOUR CYBER PASS</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* GENERATED CYBER PASS DISPLAY */
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-400 mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-orbitron text-2xl font-bold text-white">
                PASS ISSUED SUCCESSFULLY
              </h3>
              <p className="text-slate-400 text-xs">
                Your credentials have been authenticated for Techfest IIT Bombay 2026.
              </p>
            </div>

            {/* Holographic Badge Card */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#030712] to-slate-950 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    TECHFEST 2026 • 29TH EDITION
                  </div>
                  <div className="font-orbitron text-lg font-bold text-white tracking-wide">
                    FUTURE UNLEASHED
                  </div>
                  <div className="text-xs text-slate-400">IIT Bombay, Powai</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-[10px] font-mono text-cyan-300">
                    {generatedPass.accessTier}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    {generatedPass.zoneCode}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Attendee</div>
                  <div className="font-semibold text-white truncate">{generatedPass.fullName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Affiliation</div>
                  <div className="text-slate-300 truncate">{generatedPass.institution}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Domain Track</div>
                  <div className="text-cyan-400 truncate">{generatedPass.domainInterest}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Pass UID</div>
                  <div className="font-mono text-orange-400 font-bold">{generatedPass.passId}</div>
                </div>
              </div>

              {/* QR and Barcode Emulation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg">
                    <QrCode className="w-10 h-10 text-black" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    <div>SCAN AT CONVOCATION GATE</div>
                    <div>DEC 26-28, 2026</div>
                  </div>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-rajdhani font-semibold text-slate-300 hover:text-white hover:border-cyan-400"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copied ? 'COPIED!' : 'COPY ID'}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={async () => {
                  if (!generatedPass) return;
                  soundFx.playClick();
                  setIsDownloading(true);
                  try {
                    await downloadCyberPassImage(generatedPass);
                    soundFx.playSuccess();
                  } catch {
                    // Fallback
                    window.print();
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
                className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-rajdhani font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'COMPILING HIGH-RES PNG...' : 'DOWNLOAD DIGITAL PASS (PNG)'}</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  window.print();
                }}
                className="w-full sm:w-auto px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white font-rajdhani font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
                title="Print physical hardcopy pass"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>PRINT</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white font-rajdhani font-semibold text-sm transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
