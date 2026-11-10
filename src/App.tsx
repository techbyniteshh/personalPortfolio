import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './sections/HeroSection.tsx';
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

  // Scrollspy: active section tracking for navbar
  useEffect(() => {
    const sectionIds = [
      'hero',
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

  // Dynamic Sticky Alignment for Full-Page Scrollytelling:
  // When a section's height exceeds the viewport height on desktop, pin when its
  // bottom reaches the viewport bottom so all cards and buttons are fully viewable.
  useEffect(() => {
    const updateStickyAlignment = () => {
      const isDesktop = window.innerWidth >= 1025 && window.innerHeight >= 720;
      const chapters = document.querySelectorAll<HTMLElement>('.story-chapter');

      chapters.forEach((el) => {
        if (!isDesktop) {
          el.style.top = '';
          return;
        }
        const vh = window.innerHeight;
        const h = el.offsetHeight;
        if (h > vh) {
          el.style.top = `${vh - h}px`;
        } else {
          el.style.top = '0px';
        }
      });
    };

    updateStickyAlignment();
    window.addEventListener('resize', updateStickyAlignment, { passive: true });
    const timer = setTimeout(updateStickyAlignment, 600);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateStickyAlignment);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA] selection:bg-[#FF8A24] selection:text-white">
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Subtle Precision Pointer Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Multi-Chapter Scrollytelling Architecture (Full Page Sequence) */}
      <main className="relative">
        {/* Chapter 0: Hero Stage */}
        <div className="story-chapter story-chapter-hero">
          <HeroSection />
        </div>

        {/* Chapter 1: Philosophy & Engineering Perspective */}
        <div className="story-chapter story-chapter-about">
          <AboutSection />
        </div>

        {/* Chapter 2: Technical Capability Matrix */}
        <div className="story-chapter story-chapter-skills">
          <SkillsSection />
        </div>

        {/* Chapter 3: Featured Case Studies */}
        <div className="story-chapter story-chapter-projects">
          <ProjectsSection />
        </div>

        {/* Chapter 4: Academic Milestones */}
        <div className="story-chapter story-chapter-education">
          <EducationSection />
        </div>

        {/* Chapter 5: Competitive Hackathon Honors */}
        <div className="story-chapter story-chapter-achievements">
          <AchievementsSection />
        </div>

        {/* Chapter 6: Field Notes & Technical Logs */}
        <div className="story-chapter story-chapter-articles">
          <ArticlesSection />
        </div>

        {/* Chapter 7: Direct Contact & Transmission */}
        <div className="story-chapter story-chapter-contact">
          <ContactSection />
        </div>

        {/* Chapter 8: Community & Voluntary Backing */}
        <div className="story-chapter story-chapter-fuel">
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
