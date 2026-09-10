import { useEffect, useRef } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Attach to any element to fade/slide it in the first time it enters view.
 * Returns a ref; the element must also carry `data-reveal` in its markup so
 * the hidden state applies before JavaScript runs.
 */
export function useReveal({ threshold = 0.18, once = true, delay = 0 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      node.dataset.reveal = 'in';
      return undefined;
    }

    if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.reveal = 'in';
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.dataset.reveal = '';
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, delay]);

  return ref;
}

/**
 * Same idea for a container whose direct children should stagger in.
 * Each child gets an increasing transition delay.
 */
export function useStaggerReveal({ step = 90, threshold = 0.12 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const children = Array.from(node.children);
    children.forEach((child, i) => {
      child.dataset.reveal = child.dataset.reveal ?? '';
      child.style.setProperty('--reveal-delay', `${i * step}ms`);
    });

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      children.forEach((child) => {
        child.dataset.reveal = 'in';
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          children.forEach((child) => {
            child.dataset.reveal = 'in';
          });
          observer.disconnect();
        });
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [step, threshold]);

  return ref;
}
