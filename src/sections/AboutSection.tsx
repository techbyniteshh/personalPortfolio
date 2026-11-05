import React from 'react';
import { User, Lightbulb, Terminal, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const AboutSection: React.FC = () => {
  const journeyPillars = [
    {
      icon: <Terminal className="w-5 h-5 text-[#FF8A24]" />,
      title: 'Full-Stack Engineering',
      desc: 'Crafting responsive user interfaces with React, Next.js, and TypeScript, backed by robust REST APIs using Node.js and Python FastAPI.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#49C8FF]" />,
      title: 'IoT & Physical Computing',
      desc: 'Bridging software with hardware using ESP32 microcontrollers, ultrasonic telemetry, and MQTT messaging to solve real physical challenges.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#FF8A24]" />,
      title: 'Python & Applied AI',
      desc: 'Automating developer workflows, engineering regex security filters, and leveraging modern LLM APIs to build assistive developer tools.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-[#49C8FF]" />,
      title: 'Open Learning & Community',
      desc: 'Documenting project architecture, participating in university hackathons, and building accessible study platforms like PYQVerse for fellow students.',
    },
  ];

  return (
    <section id="about" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[350px] bg-[#FF8A24]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-4 backdrop-blur-md">
            <User className="w-3.5 h-3.5 text-[#FF8A24]" />
            <span>CHAPTER 02 // PHILOSOPHY & CAPABILITY</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Curious by Nature, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A24] via-[#FDBA74] to-[#49C8FF]">
              Builder by Practice.
            </span>
          </h2>
          <p className="font-body mt-4 text-base sm:text-lg text-[#A3ADBA] leading-relaxed max-w-2xl mx-auto">
            Where physical sensor circuits connect with resilient distributed software.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Narrative Card (7 cols) */}
          <div
            data-reveal
            data-reveal-delay="100"
            className="lg:col-span-7 rounded-3xl p-7 sm:p-10 bg-[#0D1118] border border-white/[0.09] flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A24] font-semibold block mb-2">
                ENGINEERING PERSPECTIVE
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-6">
                The Student Developer Journey
              </h3>
              <div className="space-y-4 font-body text-sm sm:text-base text-[#A3ADBA] leading-relaxed">
                <p>
                  I'm currently pursuing a Bachelor of Vocation (B.VOC) in Internet of Things (IoT) in India, driven by curiosity for how digital logic connects with the physical world. My journey started with Python automation scripting, which quickly expanded into full-stack web applications and microcontroller hardware prototyping.
                </p>
                <p>
                  Rather than passively consuming tutorials, I learn by identifying friction in everyday student and community life and designing software to alleviate it. Whether it is solving paper clutter during university midterms with <strong className="text-white">PYQVerse</strong>, empowering local women artisans via <strong className="text-white">SakhiBiz</strong>, or experimenting with railway sensor telemetry on the <strong className="text-white">ESP32</strong>, each project is a milestone of continuous experimentation.
                </p>
                <p>
                  I believe in writing clean, readable code, respecting user privacy, and ensuring technology remains accessible, lightweight, and human-centered.
                </p>
              </div>
            </div>

            {/* Philosophy Quote */}
            <div className="mt-8 p-4 rounded-2xl bg-[#07090D] border border-white/[0.08] flex items-start gap-3.5">
              <Lightbulb className="w-5 h-5 text-[#FF8A24] shrink-0 mt-0.5" />
              <p className="font-body text-xs sm:text-sm text-[#F5F7FA] italic leading-relaxed">
                "The best way to understand an algorithm or an embedded circuit is to build it, watch where it breaks under stress, and refine it until it just works."
              </p>
            </div>
          </div>

          {/* Core Pillars (5 cols) */}
          <div data-reveal data-reveal-delay="200" className="lg:col-span-5 grid grid-cols-1 gap-4">
            {journeyPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl p-5 bg-[#0D1118] border border-white/[0.09] hover:border-[#FF8A24]/30 hover:translate-x-1 transition-all shadow-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#121923] border border-white/[0.08] flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white">
                    {pillar.title}
                  </h4>
                </div>
                <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed pl-12">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
