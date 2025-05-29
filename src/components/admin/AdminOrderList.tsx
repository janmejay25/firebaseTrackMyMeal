
"use client";

import { useOrders } from "@/contexts/OrderContext";
import { AdminOrderItem } from "./AdminOrderItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, ListChecks } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminOrderList() {
  const { orders, loading } = useOrders();

  const pendingOrders = orders.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled').sort((a,b) => a.createdAt - b.createdAt);
  const completedOrders = orders.filter(order => order.status === 'Delivered' || order.status === 'Cancelled').sort((a,b) => b.createdAt - a.createdAt);


  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-primary">
          <ListChecks size={28} className="mr-3"/> Current Orders ({pendingOrders.length})
        </h2>
        {pendingOrders.length === 0 ? (
          <Alert className="shadow-sm">
            <Inbox className="h-4 w-4" />
            <AlertTitle>No Pending Orders</AlertTitle>
            <AlertDescription>
              All caught up! There are no active orders at the moment.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingOrders.map(order => (
              <AdminOrderItem key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {completedOrders.length > 0 && (
         <div>
         <h2 className="text-2xl font-semibold mb-4 flex items-center text-muted-foreground">
           <Inbox size={28} className="mr-3"/> Completed/Cancelled Orders ({completedOrders.length})
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-70">
           {completedOrders.slice(0,6).map(order => ( // Show recent 6 completed/cancelled
             <AdminOrderItem key={order.id} order={order} />
           ))}
         </div>
       </div>
      )}
    </div>
  );
}


function CardSkeleton() {
  return (
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-9 w-full mt-2" />
    </div>
  )
}
