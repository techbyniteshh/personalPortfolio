import React from 'react';
import { User, Lightbulb, Compass, Heart, Terminal, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const AboutSection: React.FC = () => {
  const journeyPillars = [
    {
      icon: <Terminal className="w-5 h-5 text-orange-600" />,
      title: 'Full-Stack Engineering',
      desc: 'Crafting responsive user interfaces with React, Next.js, and TypeScript, backed by robust REST APIs using Node.js and Python FastAPI.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-amber-600" />,
      title: 'IoT & Physical Computing',
      desc: 'Bridging software with hardware using ESP32 microcontrollers, ultrasonic telemetry, and MQTT messaging to solve real physical challenges.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-orange-500" />,
      title: 'Python & Applied AI',
      desc: 'Automating developer workflows, engineering regex security filters, and leveraging modern LLM APIs (Gemini) to build assistive tools.',
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber-700" />,
      title: 'Open Learning & Community',
      desc: 'Documenting project architecture, participating in university hackathons, and building accessible study platforms like PYQVerse for fellow students.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <User className="w-3.5 h-3.5" />
            <span>About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Curious by Nature, Builder by Practice.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            A look into who I am, what drives my engineering curiosity, and how I approach turning ideas into working software.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Main Narrative Card (7 cols) */}
          <div className="lg:col-span-7 neu-raised rounded-3xl p-6 sm:p-8 bg-[#F4EFEA] border border-white/80 flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1C2228] mb-4">
                The Student Developer Journey
              </h3>
              <div className="space-y-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
                <p>
                  I'm currently an undergraduate Computer Science student in India with an innate curiosity for how digital systems interact with the real world. My journey started with a fascination for writing simple Python automation scripts, which soon escalated into building full-stack web applications and wiring micro-controller breadboards.
                </p>
                <p>
                  Rather than passively consuming tutorials, I learn by identifying friction in everyday student and community life and designing software to alleviate it. Whether it is solving paper clutter during university midterms with <strong className="text-[#1C2228]">PYQVerse</strong>, empowering local women artisans via <strong className="text-[#1C2228]">SakhiBiz</strong>, or experimenting with railway sensor telemetry on the <strong className="text-[#1C2228]">ESP32</strong>, each project is a milestone of experimentation and continuous learning.
                </p>
                <p>
                  I believe in writing clean, readable code, respecting user privacy, and ensuring technology remains accessible, lightweight, and human-centered.
                </p>
              </div>
            </div>

            {/* Philosophy Quote */}
            <div className="mt-8 neu-inset p-4 rounded-2xl flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium text-[#1C2228] italic">
                "The best way to understand an algorithm or an embedded circuit is to build it, watch where it breaks under stress, and refine it until it just works."
              </p>
            </div>
          </div>

          {/* Core Pillars (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {journeyPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="neu-raised-sm rounded-2xl p-5 bg-[#FAF7F2] border border-white/60 hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center shrink-0">
                    {pillar.icon}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-[#1C2228]">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#55606E] leading-relaxed">
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
