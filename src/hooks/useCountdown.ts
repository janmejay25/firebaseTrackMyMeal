
"use client";

import { useState, useEffect } from 'react';

export function useCountdown(targetTimestamp?: number) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!targetTimestamp) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;
      
      if (difference <= 0) {
        setTimeLeft(0); // Time is up or in the past
        return 0;
      }
      
      const minutes = Math.floor(difference / (1000 * 60));
      setTimeLeft(minutes);
      return difference;
    };

    // Initial calculation
    const initialDifference = calculateTimeLeft();
    if (initialDifference <= 0) return;


    const timer = setInterval(() => {
      const difference = calculateTimeLeft();
      if (difference <= 0) {
        clearInterval(timer);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return timeLeft;
}
