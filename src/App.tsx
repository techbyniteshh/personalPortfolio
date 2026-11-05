import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './sections/HeroSection.tsx';
import { ArduinoShowcaseSection } from './sections/ArduinoShowcaseSection.tsx';
import { AboutSection } from './sections/AboutSection.tsx';
import { SkillsSection } from './sections/SkillsSection.tsx';
import { ProjectsSection } from './sections/ProjectsSection.tsx';
import { EducationSection } from './sections/EducationSection.tsx';
import { AchievementsSection } from './sections/AchievementsSection.tsx';
import { ArticlesSection } from './sections/ArticlesSection.tsx';
import { ContactSection } from './sections/ContactSection.tsx';
import { FuelCreativitySection } from './sections/FuelCreativitySection.tsx';
import { Footer } from './components/Footer.tsx';
import { BackToTop } from './components/BackToTop.tsx';
import { useScrollReveal } from './hooks/useScrollReveal.ts';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Activate subtle text entrance animations
  useScrollReveal();

  useEffect(() => {
    const sectionIds = [
      'hero',
      'arduino-experience',
      'about',
      'skills',
      'projects',
      'education',
      'achievements',
      'articles',
      'contact',
      'fuel',
    ];

    const handleScroll = () => {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 220) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F0F4F8] selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections with Sticky Scroll Storytelling Layers */}
      <main className="relative">
        {/* Layer 1: Pinned Cinematic Hero */}
        <div className="sticky-story-hero">
          <HeroSection />
        </div>

        {/* Layer 2: Seamless Dark 3D Arduino Showcase Transition */}
        <div className="sticky-story-arduino">
          <ArduinoShowcaseSection />
        </div>

        {/* Layer 3: Narrative Flow & Content-Dense Sections (Natural Fluid Scroll) */}
        <div className="sticky-story-flow bg-[#080B10]">
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <EducationSection />
          <AchievementsSection />
          <ArticlesSection />
          <ContactSection />
          <FuelCreativitySection />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities */}
      <BackToTop />
    </div>
  );
}
