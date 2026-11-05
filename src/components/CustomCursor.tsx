import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if pointer is fine (mouse, trackpad) and user doesn't prefer reduced motion
    const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    const hasFinePointer = hasMatchMedia ? window.matchMedia('(pointer: fine)').matches : false;
    const prefersReducedMotion = hasMatchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target && typeof target.closest === 'function') {
        const isInteractive = Boolean(
          target.closest('a, button, input, textarea, select, [role="button"], canvas')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[100] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-hidden="true"
    >
      <div
        className={`rounded-full transition-all duration-200 ease-out border ${
          isHoveringInteractive
            ? 'w-10 h-10 border-[#FF8A24]/60 bg-[#FF8A24]/10 scale-110'
            : 'w-4 h-4 border-[#49C8FF]/40 bg-[#49C8FF]/10'
        }`}
      />
    </div>
  );
};
