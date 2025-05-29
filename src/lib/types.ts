
export interface Order {
  id: string;
  customerName: string;
  contact: string;
  itemName: string;
  quantity: number;
  specialInstructions?: string;
  status: 'Pending' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: number; // Timestamp
  estimatedArrivalTime?: number; // Timestamp
}
