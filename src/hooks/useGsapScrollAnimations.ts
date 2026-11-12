import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapScrollAnimations() {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Use gsap.context for bulletproof cleanup in React
    const ctx = gsap.context(() => {
      // 1. Reveal Section Headers smoothly
      const sectionHeaders = document.querySelectorAll('.gsap-header');
      sectionHeaders.forEach((header) => {
        gsap.fromTo(
          header,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // 2. Stagger Cards in Domains Section
      const domainCards = document.querySelectorAll('#domains .group');
      if (domainCards.length > 0) {
        gsap.fromTo(
          domainCards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#domains',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 3. Stagger Cards in Events Section
      const eventCards = document.querySelectorAll('#events .group');
      if (eventCards.length > 0) {
        gsap.fromTo(
          eventCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#events',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 4. Stagger Speaker Cards
      const speakerCards = document.querySelectorAll('#speakers .group');
      if (speakerCards.length > 0) {
        gsap.fromTo(
          speakerCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#speakers',
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // 5. Stat Counter Animations in About Section
      const statItems = document.querySelectorAll('.gsap-stat-card');
      if (statItems.length > 0) {
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 25, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: statItems[0],
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => {
      ctx.revert(); // clean up all GSAP tweens and ScrollTriggers
    };
  }, []);
}
