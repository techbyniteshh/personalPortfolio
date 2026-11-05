import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const revealElement = (el: Element) => {
      el.classList.add('revealed');
    };

    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    // Check if user prefers reduced motion or window/document is missing
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      elements.forEach(revealElement);
      return;
    }

    // Immediately reveal elements that are already within or near the initial viewport
    const windowH = typeof window !== 'undefined' ? window.innerHeight || 800 : 800;
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowH + 120) {
        revealElement(el);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '120px 0px 120px 0px',
      }
    );

    elements.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });

    // Safety timeout: after 1200ms ensure all elements are visible so no section is left hidden
    const timer = setTimeout(() => {
      elements.forEach(revealElement);
    }, 1200);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
