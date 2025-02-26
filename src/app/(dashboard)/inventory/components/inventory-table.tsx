"use client";

import { useState } from "react";
import { useInventory, InventoryItem } from "@/hooks/use-inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Minus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import InventoryItemDialog from "./inventory-item-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import StockAdjustDialog from "./stock-adjust-dialog";

interface InventoryTableProps {
  items: InventoryItem[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [isRemoveStockDialogOpen, setIsRemoveStockDialogOpen] = useState(false);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleAddStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsAddStockDialogOpen(true);
  };

  const handleRemoveStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsRemoveStockDialogOpen(true);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min. Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={item.stockQuantity <= item.minStock ? "text-red-500 font-bold" : ""}>
                        {item.stockQuantity}
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        {item.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{item.supplier || "-"}</TableCell>
                  <TableCell>
                    {item.lastRestocked
                      ? formatDate(new Date(item.lastRestocked))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleAddStock(item)}
                        title="Add Stock"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveStock(item)}
                        title="Remove Stock"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(item)}
                        title="Edit Item"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        title="Delete Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <InventoryItemDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        item={selectedItem}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={selectedItem}
      />

      {/* Add Stock Dialog */}
      <StockAdjustDialog
        open={isAddStockDialogOpen}
        onOpenChange={setIsAddStockDialogOpen}
        item={selectedItem}
        mode="add"
      />

      {/* Remove Stock Dialog */}
      <StockAdjustDialog
        open={isRemoveStockDialogOpen}
        onOpenChange={setIsRemoveStockDialogOpen}
        item={selectedItem}
        mode="remove"
      />
    </>
  );
} 