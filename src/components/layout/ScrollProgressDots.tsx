'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
}

interface ScrollProgressDotsProps {
  sections: Section[];
}

export default function ScrollProgressDots({ sections }: ScrollProgressDotsProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <div key={id} className="relative flex items-center justify-end">
            {/* Tooltip */}
            {hoveredDot === id && (
              <div className="absolute right-7 bg-green-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg pointer-events-none">
                {label}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-green-900 rotate-45" />
              </div>
            )}

            {/* Dot */}
            <button
              onClick={() => scrollToSection(id)}
              onMouseEnter={() => setHoveredDot(id)}
              onMouseLeave={() => setHoveredDot(null)}
              aria-label={`Navigate to ${label}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-3 h-3 bg-green-700 ring-2 ring-green-700/30 ring-offset-2'
                  : 'w-2 h-2 bg-slate-300 hover:bg-green-400 hover:scale-125'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
