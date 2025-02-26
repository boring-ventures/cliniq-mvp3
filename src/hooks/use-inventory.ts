import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Define types for inventory items
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  stockQuantity: number;
  unit: string;
  minStock: number;
  supplier?: string;
  price: number;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewInventoryItem {
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier?: string;
  price: number;
}

export interface StockAdjustment {
  quantity: number;
  notes?: string;
}

// Main hook for inventory management
export function useInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showLowStock, setShowLowStock] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory items with filters
  const {
    data: inventoryItems = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["inventory", selectedCategory, searchQuery, showLowStock],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "All Categories") {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (showLowStock) {
        params.append("lowStock", "true");
      }

      const response = await fetch(`/api/inventory?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch inventory items");
      }
      return response.json();
    },
  });

  // Fetch categories
  const { data: categories = ["All Categories"] } = useQuery({
    queryKey: ["inventoryCategories"],
    queryFn: async () => {
      const response = await fetch("/api/inventory/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  // Create a new inventory item
  const createInventoryItem = useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create inventory item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Update an inventory item
  const updateInventoryItem = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewInventoryItem>;
    }) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update inventory item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Delete an inventory item
  const deleteInventoryItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete inventory item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Inventory item deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Adjust inventory stock
  const adjustStock = useMutation({
    mutationFn: async ({
      id,
      adjustment,
    }: {
      id: string;
      adjustment: StockAdjustment;
    }) => {
      const response = await fetch(`/api/inventory/${id}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustment),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to adjust stock");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Stock adjusted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Get low stock items
  const lowStockItems = inventoryItems.filter(
    (item: InventoryItem) => item.stockQuantity <= item.minStock
  );

  return {
    inventoryItems,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showLowStock,
    setShowLowStock,
    categories,
    lowStockItems,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustStock,
  };
}
