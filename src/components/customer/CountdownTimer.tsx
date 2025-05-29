
"use client";

import { useState, useEffect } from 'react';
import { useCountdown } from "@/hooks/useCountdown";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface CountdownTimerProps {
  targetTimestamp?: number;
  orderStatus: string;
}

export function CountdownTimer({ targetTimestamp, orderStatus }: CountdownTimerProps) {
  const { secondsRemaining } = useCountdown(targetTimestamp);
  const [initialDurationForProgressBar, setInitialDurationForProgressBar] = useState<number | null>(null);

  useEffect(() => {
    if (targetTimestamp && (orderStatus === 'Preparing' || orderStatus === 'Out for Delivery')) {
      const now = Date.now();
      const duration = Math.max(0, Math.floor((targetTimestamp - now) / 1000));
      setInitialDurationForProgressBar(duration);
    } else {
      setInitialDurationForProgressBar(null);
    }
  }, [targetTimestamp, orderStatus]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (orderStatus === 'Pending' || !targetTimestamp) {
     return (
      <div className="flex items-center text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md shadow">
        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
        <span>Estimated time will be available once the order is confirmed.</span>
      </div>
    );
  }
  
  if (orderStatus === 'Delivered' || orderStatus === 'Ready for Pickup') {
     return (
      <div className="flex items-center text-sm text-green-600 p-3 bg-green-500/20 rounded-md shadow">
        <CheckCircle2 className="h-5 w-5 mr-2" />
        <span>Order is {orderStatus.toLowerCase()}!</span>
      </div>
    );
  }
  
  if (orderStatus === 'Cancelled') {
    return (
     <div className="flex items-center text-sm text-destructive p-3 bg-destructive/20 rounded-md shadow">
       <AlertCircle className="h-5 w-5 mr-2" />
       <span>Order has been cancelled.</span>
     </div>
   );
 }

  if (secondsRemaining === null) {
    return (
      <div className="flex items-center text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md shadow">
        <Clock className="h-5 w-5 mr-2" />
        <span>Loading arrival time...</span>
      </div>
    );
  }

  if (secondsRemaining <= 0) {
    return (
      <div className="flex items-center text-sm text-accent-foreground p-3 bg-accent/80 rounded-md shadow-md">
        <Clock className="h-5 w-5 mr-2" />
        <span className="font-semibold">Arriving now or very soon!</span>
      </div>
    );
  }

  // Active timer display
  const radius = 45;
  const strokeWidth = 8; // Adjusted for a slightly thinner stroke
  const circumference = 2 * Math.PI * radius;
  
  const progress = initialDurationForProgressBar && initialDurationForProgressBar > 0 && secondsRemaining !== null
    ? Math.max(0, Math.min(1, secondsRemaining / initialDurationForProgressBar))
    : 0;
  
  const offset = circumference * (1 - progress);
  const formattedTime = formatTime(secondsRemaining);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-lg bg-card">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-secondary"
            fill="transparent"
          />
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-accent"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.3s linear' }} // Smoother transition
            strokeLinecap="round" // Rounded ends for the progress bar
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl sm:text-4xl font-bold text-accent-foreground">
            {formattedTime}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Remaining</div>
        </div>
      </div>
    </div>
  );
}
