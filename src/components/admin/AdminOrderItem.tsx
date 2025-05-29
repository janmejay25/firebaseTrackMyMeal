
"use client";

import type { Order } from "@/lib/types";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Clock, Save, User, Package, Phone, ListOrdered, Info, Edit3, XCircle, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const statusColors: Record<Order['status'], string> = {
  Pending: "bg-yellow-500 hover:bg-yellow-500",
  Preparing: "bg-blue-500 hover:bg-blue-500",
  'Ready for Pickup': "bg-teal-500 hover:bg-teal-500",
  'Out for Delivery': "bg-indigo-500 hover:bg-indigo-500",
  Delivered: "bg-green-500 hover:bg-green-500",
  Cancelled: "bg-red-500 hover:bg-red-500",
};

const availableStatuses: Order['status'][] = ['Pending', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'];


interface AdminOrderItemProps {
  order: Order;
}

export function AdminOrderItem({ order }: AdminOrderItemProps) {
  const [estimatedTime, setEstimatedTime] = useState("");
  const [isEditingTime, setIsEditingTime] = useState(false);
  const { updateOrderEstimatedTime, updateOrderStatus } = useOrders();
  const { toast } = useToast();

  const handleUpdateTime = (e: FormEvent) => {
    e.preventDefault();
    const timeInMinutes = parseInt(estimatedTime, 10);
    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
      toast({ title: "Invalid Time", description: "Please enter a valid number of minutes.", variant: "destructive" });
      return;
    }
    updateOrderEstimatedTime(order.id, timeInMinutes);
    toast({ title: "Time Updated", description: `Order ${order.id} estimated arrival time updated.` });
    setEstimatedTime("");
    setIsEditingTime(false);
  };

  const handleStatusChange = (newStatus: Order['status']) => {
    updateOrderStatus(order.id, newStatus);
    toast({ title: "Status Updated", description: `Order ${order.id} status changed to ${newStatus}.` });
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">Order ID: {order.id}</CardTitle>
          <Badge className={`text-white ${statusColors[order.status]}`}>{order.status}</Badge>
        </div>
        <CardDescription>
          Placed on: {new Date(order.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p><User size={16} className="inline mr-2 text-muted-foreground" /><strong>Customer:</strong> {order.customerName} ({order.contact})</p>
        <p><Package size={16} className="inline mr-2 text-muted-foreground" /><strong>Item:</strong> {order.itemName} (Qty: {order.quantity})</p>
        {order.specialInstructions && (
          <p className="text-xs"><Info size={14} className="inline mr-1 text-muted-foreground" /><strong>Instructions:</strong> {order.specialInstructions}</p>
        )}
        
        <div className="mt-2 pt-2 border-t">
          <label htmlFor={`status-${order.id}`} className="block text-xs font-medium text-muted-foreground mb-1">Update Status</label>
          <Select value={order.status} onValueChange={handleStatusChange}>
            <SelectTrigger id={`status-${order.id}`} className="w-full sm:w-[180px]">
              <SelectValue placeholder="Change status" />
            </SelectTrigger>
            <SelectContent>
              {availableStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {order.estimatedArrivalTime && (
          <p className="text-xs text-accent-foreground font-medium bg-accent/20 p-2 rounded-md">
            <Clock size={14} className="inline mr-1" />
            Estimated Arrival: {new Date(order.estimatedArrivalTime).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {isEditingTime ? (
          <form onSubmit={handleUpdateTime} className="flex gap-2 items-center w-full">
            <Input
              type="number"
              placeholder="Minutes to prepare"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="flex-grow h-9"
              min="1"
            />
            <Button type="submit" size="sm" variant="default"><Save size={16} /></Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditingTime(false)}><XCircle size={16} /></Button>
          </form>
        ) : (
          <Button onClick={() => setIsEditingTime(true)} variant="outline" size="sm" className="w-full">
            <Edit3 size={16} className="mr-2" /> Set/Update Prep Time
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
