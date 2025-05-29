
"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface CountdownTimerProps {
  targetTimestamp?: number;
  orderStatus: string;
}

export function CountdownTimer({ targetTimestamp, orderStatus }: CountdownTimerProps) {
  const timeLeftInMinutes = useCountdown(targetTimestamp);

  if (orderStatus === 'Pending' || !targetTimestamp) {
     return (
      <div className="flex items-center text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
        <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
        <span>Estimated time will be available once the order is confirmed.</span>
      </div>
    );
  }
  
  if (orderStatus === 'Delivered' || orderStatus === 'Ready for Pickup') {
     return (
      <div className="flex items-center text-sm text-green-600 p-3 bg-green-500/20 rounded-md">
        <CheckCircle2 className="h-5 w-5 mr-2" />
        <span>Order is {orderStatus.toLowerCase()}!</span>
      </div>
    );
  }
  
  if (orderStatus === 'Cancelled') {
    return (
     <div className="flex items-center text-sm text-destructive p-3 bg-destructive/20 rounded-md">
       <AlertCircle className="h-5 w-5 mr-2" />
       <span>Order has been cancelled.</span>
     </div>
   );
 }


  if (timeLeftInMinutes === null) {
    return (
      <div className="flex items-center text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md">
        <Clock className="h-5 w-5 mr-2" />
        <span>Loading arrival time...</span>
      </div>
    );
  }

  if (timeLeftInMinutes <= 0) {
    return (
      <div className="flex items-center text-sm text-accent-foreground p-3 bg-accent/80 rounded-md shadow-md">
        <Clock className="h-5 w-5 mr-2" />
        <span className="font-semibold">Arriving now or very soon!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-lg text-accent-foreground p-4 bg-accent rounded-lg shadow-lg">
      <Clock className="h-6 w-6 mr-3" />
      <span className="font-bold">
        {timeLeftInMinutes} {timeLeftInMinutes === 1 ? "minute" : "minutes"} remaining
      </span>
    </div>
  );
}
