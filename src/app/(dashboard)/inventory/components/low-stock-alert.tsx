"use client";

import { InventoryItem } from "@/hooks/use-inventory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface LowStockAlertProps {
  items: InventoryItem[];
}

export default function LowStockAlert({ items }: LowStockAlertProps) {
  const router = useRouter();
  
  if (items.length === 0) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>
          {items.length} {items.length === 1 ? "item is" : "items are"} running low on stock.
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
          onClick={() => router.push("/inventory?tab=low")}
        >
          View Low Stock Items
        </Button>
      </AlertDescription>
    </Alert>
  );
} 