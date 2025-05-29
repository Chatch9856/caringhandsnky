
import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationHookOptions {
  threshold?: number;
  triggerOnce?: boolean;
  animationClass?: string; // e.g., 'animate-fade-in-up'
  initialClass?: string; // e.g., 'opacity-0'
}

const useScrollAnimation = <T extends HTMLElement,>(
  options?: ScrollAnimationHookOptions
): React.RefObject<T> => {
  const { 
    threshold = 0.1, 
    triggerOnce = true,
    animationClass = 'animate-fade-in-up', // Default Tailwind animation
    initialClass = 'opacity-0' // Start invisible
  } = options || {};
  const ref = useRef<T>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove(initialClass);
        entry.target.classList.add(...animationClass.split(' '));
        if (triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else {
        if (!triggerOnce) {
          entry.target.classList.remove(...animationClass.split(' '));
          entry.target.classList.add(initialClass);
        }
      }
    });
  }, [triggerOnce, animationClass, initialClass]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Apply initial class before observing
    element.classList.add(initialClass);

    const observer = new IntersectionObserver(handleIntersect, { threshold });
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, threshold, handleIntersect, initialClass]);

  return ref;
};

export default useScrollAnimation;
