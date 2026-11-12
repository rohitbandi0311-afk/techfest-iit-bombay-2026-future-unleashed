/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { DomainsSection } from './components/DomainsSection';
import { EventsSection } from './components/EventsSection';
import { Experience3DLabSection } from './components/Experience3DLabSection';
import { SpeakersSection } from './components/SpeakersSection';
import { Footer } from './components/Footer';
import { PassRegistrationModal } from './components/PassRegistrationModal';
import { EventDetailModal } from './components/EventDetailModal';
import { TechDomain, TechfestEvent } from './types/techfest';
import { useGsapScrollAnimations } from './hooks/useGsapScrollAnimations';

export default function App() {
  useGsapScrollAnimations();

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedPassDomain, setSelectedPassDomain] = useState('Artificial Intelligence');
  const [selectedEventModal, setSelectedEventModal] = useState<TechfestEvent | null>(null);
  const [eventDomainFilter, setEventDomainFilter] = useState<string | null>(null);

  const handleOpenPass = (domainName = 'Artificial Intelligence') => {
    setSelectedPassDomain(domainName);
    setIsPassModalOpen(true);
  };

  const handleExplore = () => {
    const el = document.getElementById('about');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectDomain = (domain: TechDomain) => {
    setEventDomainFilter(domain.id);
    const el = document.getElementById('events');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectEvent = (event: TechfestEvent) => {
    setSelectedEventModal(event);
  };

  const handleRegisterFromEvent = (event: TechfestEvent) => {
    setSelectedEventModal(null);
    handleOpenPass(event.title);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* Cyber Scanline Subtle Texture Overlay */}
      <div className="fixed inset-0 cyber-scanlines z-30 pointer-events-none opacity-40" />

      {/* Main Navbar */}
      <Navbar onOpenPassModal={() => handleOpenPass('General Festival')} />

      {/* Hero Section with Interactive 3D Future Unleashed Core */}
      <main className="flex-1">
        <HeroSection
          onExplore={handleExplore}
          onOpenPass={() => handleOpenPass('General Festival')}
        />

        {/* About Techfest IIT Bombay Section with 3D Quantum Gateway */}
        <AboutSection />

        {/* 5 Technology Domains with Interactive 3D Cards */}
        <DomainsSection onSelectDomain={handleSelectDomain} />

        {/* Competitions, Combats & Hackathons */}
        <EventsSection
          onSelectEvent={handleSelectEvent}
          onRegisterEvent={handleRegisterFromEvent}
          selectedDomainFilter={eventDomainFilter}
          onClearDomainFilter={() => setEventDomainFilter(null)}
        />

        {/* Interactive 3D Holo-Deck Lab with Exploded View & Lighting Swatches */}
        <Experience3DLabSection />

        {/* Global Convocation Keynote Speakers */}
        <SpeakersSection />
      </main>

      {/* Footer with IIT Bombay Campus Coordinates & Dispatch */}
      <Footer onOpenPass={() => handleOpenPass('General Festival')} />

      {/* Modals */}
      <PassRegistrationModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        defaultDomain={selectedPassDomain}
      />

      <EventDetailModal
        event={selectedEventModal}
        isOpen={selectedEventModal !== null}
        onClose={() => setSelectedEventModal(null)}
        onRegister={handleRegisterFromEvent}
      />
    </div>
  );
}
