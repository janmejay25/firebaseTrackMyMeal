
"use client";

import { useState, useEffect } from 'react';

interface CountdownResult {
  secondsRemaining: number | null;
}

export function useCountdown(targetTimestamp?: number): CountdownResult {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!targetTimestamp) {
      setSecondsRemaining(null);
      return;
    }

    let timerId: NodeJS.Timeout;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setSecondsRemaining(0);
        return 0; // Indicate to stop interval
      }

      const remainingSec = Math.max(0, Math.floor(difference / 1000));
      setSecondsRemaining(remainingSec);
      return difference; // Return full difference for interval check
    };

    // Initial calculation
    const initialDifference = calculateTimeLeft();
    
    if (initialDifference <= 0) {
      // If time is already up or in the past on initial load, ensure state is 0 and don't start interval
      if (secondsRemaining !== 0) { // Only set if not already 0 to avoid potential loop with initialDifference being 0
         setSecondsRemaining(0);
      }
      return;
    }

    // Start interval only if there's time remaining
    timerId = setInterval(() => {
      const diff = calculateTimeLeft();
      if (diff <= 0) {
        clearInterval(timerId);
      }
    }, 1000); // Update every second

    return () => clearInterval(timerId);
  }, [targetTimestamp]); // Rerun effect if targetTimestamp changes

  return { secondsRemaining };
}
