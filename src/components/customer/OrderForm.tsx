
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrders } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

const orderFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters.").max(50),
  contact: z.string().min(5, "Contact info must be at least 5 characters (e.g., phone or email)."),
  itemName: z.string().min(2, "Item name must be at least 2 characters.").max(100),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1.").max(100),
  specialInstructions: z.string().max(200, "Instructions too long.").optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function OrderForm() {
  const { addOrder } = useOrders();
  const { toast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: "",
      contact: "",
      itemName: "",
      quantity: 1,
      specialInstructions: "",
    },
  });

  function onSubmit(data: OrderFormValues) {
    const newOrder = addOrder(data);
    toast({
      title: "Order Placed!",
      description: (
        <div>
          <p>Your order for {data.quantity}x {data.itemName} has been placed.</p>
          <p className="font-semibold mt-1">Order ID: {newOrder.id}</p>
          <p className="text-xs text-muted-foreground">Keep this ID to track your order.</p>
        </div>
      ),
      variant: "default",
    });
    form.reset();
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Place Your Order</CardTitle>
        <CardDescription>Fill in the details below to submit your food order.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact (Phone/Email)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., 555-1234 or jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Pepperoni Pizza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., Extra cheese, no onions"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg">
              <Send size={18} className="mr-2" /> Place Order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
