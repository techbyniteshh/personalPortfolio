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
import { ScrollProgress } from './components/ScrollProgress.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { useScrollReveal } from './hooks/useScrollReveal.ts';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Activate subtle scroll-reveal entrance animations
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
          if (rect.top <= 240) {
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
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] selection:bg-[#FF8A24] selection:text-white">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Subtle Precision Pointer Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Multi-Chapter Scrollytelling Architecture */}
      <main className="relative">
        {/* Chapter 0: Atmospheric Hero Stage (Pinned) */}
        <div className="story-chapter-hero">
          <HeroSection />
        </div>

        {/* Chapter 1: Arduino 3D Digital Twin Stage (Layered Over Hero) */}
        <div className="story-chapter-arduino">
          <ArduinoShowcaseSection />
        </div>

        {/* Chapter 2: Philosophy & Engineering Perspective (Layered Over Arduino) */}
        <div className="story-chapter-about">
          <AboutSection />
        </div>

        {/* Flow Chapters: Content-Dense Matrices, Case Studies & Finale (Natural Fluid Scroll) */}
        <div className="story-chapter-flow bg-[#07090D]">
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
