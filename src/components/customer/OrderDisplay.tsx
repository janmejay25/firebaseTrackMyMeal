
"use client";

import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownTimer } from "./CountdownTimer";
import { Package, User, Phone, ListOrdered, Hash, Info } from "lucide-react";

interface OrderDisplayProps {
  order: Order;
}

const statusColors: Record<Order['status'], string> = {
  Pending: "bg-yellow-500 hover:bg-yellow-500",
  Preparing: "bg-blue-500 hover:bg-blue-500",
  'Ready for Pickup': "bg-teal-500 hover:bg-teal-500",
  'Out for Delivery': "bg-indigo-500 hover:bg-indigo-500",
  Delivered: "bg-green-500 hover:bg-green-500",
  Cancelled: "bg-red-500 hover:bg-red-500",
};


export function OrderDisplay({ order }: OrderDisplayProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-semibold text-primary">Order Details</CardTitle>
            <CardDescription>Status of your order <span className="font-bold text-primary">{order.id}</span></CardDescription>
          </div>
          <Badge className={`text-white ${statusColors[order.status]}`}>{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Name:</strong> <span className="ml-1">{order.customerName}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Contact:</strong> <span className="ml-1">{order.contact}</span>
          </div>
          <div className="flex items-center">
            <Package className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Item:</strong> <span className="ml-1">{order.itemName}</span>
          </div>
          <div className="flex items-center">
            <ListOrdered className="w-4 h-4 mr-2 text-muted-foreground" />
            <strong>Quantity:</strong> <span className="ml-1">{order.quantity}</span>
          </div>
        </div>
        {order.specialInstructions && (
          <div className="flex items-start text-sm">
            <Info className="w-4 h-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div>
              <strong>Special Instructions:</strong>
              <p className="ml-1 text-muted-foreground">{order.specialInstructions}</p>
            </div>
          </div>
        )}
         <div className="pt-4">
          <CountdownTimer targetTimestamp={order.estimatedArrivalTime} orderStatus={order.status} />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Order placed on: {new Date(order.createdAt).toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
}
