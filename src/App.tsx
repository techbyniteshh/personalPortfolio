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

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');

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
      const scrollPosition = window.scrollY + 250;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#1C2228] selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <AchievementsSection />
        <ArticlesSection />
        <ContactSection />
        <FuelCreativitySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Utilities */}
      <BackToTop />
    </div>
  );
}
