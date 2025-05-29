
"use client";

import { useState, type FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from '@/lib/types';
import { useOrders } from '@/contexts/OrderContext';
import { OrderDisplay } from './OrderDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, AlertTriangle } from "lucide-react";

export function OrderSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<Order | null | undefined>(undefined); // undefined initially, null if not found
  const { findOrder, loading } = useOrders();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchedOrder(null); // Or show a message to enter search term
      return;
    }
    const order = findOrder(searchTerm);
    setSearchedOrder(order);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Track Your Order</CardTitle>
          <CardDescription>Enter your Order ID or Name to check its status.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Order ID or Your Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
              aria-label="Search for order"
            />
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Search size={18} className="mr-2" /> Track Order
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <p className="text-center text-muted-foreground">Loading orders...</p>}

      {searchedOrder === null && searchTerm && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>
            No order found for "{searchTerm}". Please check your Order ID or Name and try again.
          </AlertDescription>
        </Alert>
      )}

      {searchedOrder && <OrderDisplay order={searchedOrder} />}
    </div>
  );
}
