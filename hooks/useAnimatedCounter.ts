
import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const useAnimatedCounter = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startValueRef.current = count; // Start from the current displayed value
    startTimeRef.current = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutExpo(progress);
      
      const currentCount = Math.round(startValueRef.current + (endValue - startValueRef.current) * easedProgress);
      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, duration]);

  return count;
};
