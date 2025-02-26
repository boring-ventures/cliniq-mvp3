"use client";

import { useState } from "react";
import { useInventoryItem } from "@/hooks/use-inventory-item";
import { InventoryItem } from "@/hooks/use-inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface StockAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  mode: "add" | "remove";
}

export default function StockAdjustDialog({
  open,
  onOpenChange,
  item,
  mode,
}: StockAdjustDialogProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const { addStock, removeStock } = useInventoryItem(item?.id || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item || quantity <= 0) return;
    
    try {
      if (mode === "add") {
        await addStock.mutateAsync({ quantity, notes });
      } else {
        await removeStock.mutateAsync({ quantity, notes });
      }
      onOpenChange(false);
      setQuantity(1);
      setNotes("");
    } catch (error) {
      console.error(`Error ${mode === "add" ? "adding" : "removing"} stock:`, error);
    }
  };

  const isLoading = addStock.isPending || removeStock.isPending;
  const title = mode === "add" ? "Add Stock" : "Remove Stock";
  const buttonText = mode === "add" ? "Add Stock" : "Remove Stock";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}: {item?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity ({item?.unit})</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={mode === "add" ? "Stock purchase details..." : "Usage details..."}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || quantity <= 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 