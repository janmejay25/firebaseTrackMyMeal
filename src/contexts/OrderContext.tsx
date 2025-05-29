
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order } from '@/lib/types';

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedArrivalTime'>) => Order;
  updateOrderEstimatedTime: (orderId: string, estimatedTimeInMinutes: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  findOrder: (searchTerm: string) => Order | undefined;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDER_STORAGE_KEY = "orderdash_orders";

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Load orders from localStorage on initial client-side mount
    if (typeof window !== "undefined") {
      try {
        const storedOrders = localStorage.getItem(ORDER_STORAGE_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error("Failed to load orders from localStorage:", error);
      }
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    // Save orders to localStorage whenever they change, only on client-side and after initial load
    if (typeof window !== "undefined" && !isInitialLoad) {
      try {
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Failed to save orders to localStorage:", error);
      }
    }
  }, [orders, isInitialLoad]);


  const addOrder = (newOrderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'estimatedArrivalTime'>): Order => {
    const newOrder: Order = {
      ...newOrderData,
      id: `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
      status: 'Pending',
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  };

  const updateOrderEstimatedTime = (orderId: string, estimatedTimeInMinutes: number) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, estimatedArrivalTime: Date.now() + estimatedTimeInMinutes * 60 * 1000, status: 'Preparing' }
          : order
      )
    );
  };
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const findOrder = (searchTerm: string): Order | undefined => {
    if (!searchTerm) return undefined;
    const term = searchTerm.toLowerCase();
    return orders.find(
      order => order.id.toLowerCase() === term || order.customerName.toLowerCase().includes(term)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderEstimatedTime, updateOrderStatus, findOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
