"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, AlertTriangle } from "lucide-react";
import { useInventoryItem } from "@/hooks/use-inventory-item";
import { UsageLogTable } from "@/components/inventory/usage-log-table";
import { StockAdjustmentForm } from "@/components/inventory/stock-adjustment-form";

export default function InventoryItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;

  const {
    item,
    isLoading,
    error,
    usageLogs,
    isLoadingLogs,
    addStock,
    removeStock,
  } = useInventoryItem(itemId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The requested inventory item could not be found.
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
      </Button>

      <div className="grid gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {item.name}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{item.category}</Badge>
              <Badge
                variant={
                  item.stockQuantity <= item.minStock
                    ? "destructive"
                    : "default"
                }
              >
                {item.stockQuantity <= item.minStock
                  ? "Low Stock"
                  : "In Stock"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Description
                  </dt>
                  <dd className="text-sm">
                    {item.description || "No description provided"}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Current Stock
                    </dt>
                    <dd className="text-2xl font-bold">
                      {item.stockQuantity} {item.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Price</dt>
                    <dd className="text-2xl font-bold">
                      ${item.price.toFixed(2)}
                    </dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Minimum Stock
                    </dt>
                    <dd>{item.minStock} {item.unit}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Supplier
                    </dt>
                    <dd>{item.supplier || "Not specified"}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <StockAdjustmentForm
                onAddStock={addStock}
                onRemoveStock={removeStock}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage History</CardTitle>
          </CardHeader>
          <CardContent>
            <UsageLogTable
              logs={usageLogs}
              isLoading={isLoadingLogs}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 