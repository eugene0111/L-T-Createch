"use client";

import { useState, useEffect } from "react";

// Animated counter hook
function useCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const count = useCounter(value);
  return <>{count.toFixed(decimals)}</>;
}
