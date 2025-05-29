
"use client";

import { OrderForm } from "./OrderForm";
import { OrderSearch } from "./OrderSearch";
import { Separator } from "@/components/ui/separator";

export function CustomerDashboardLayout() {
  return (
    <div className="space-y-12">
      <OrderForm />
      <Separator className="my-8" />
      <OrderSearch />
    </div>
  );
}
