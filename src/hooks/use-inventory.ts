import { useState, useMemo } from "react";
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
  isCategory: boolean;
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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showLowStock, setShowLowStock] = useState(false);

  // Fetch categories
  const {
    data: categories = ["All Categories"],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["inventoryCategories"],
    queryFn: async () => {
      const response = await fetch("/api/inventory/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      return ["All Categories", ...(Array.isArray(data) ? data : [])];
    },
  });

  // Fetch inventory items
  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: itemsError,
  } = useQuery({
    queryKey: ["inventory", selectedCategory, searchQuery, showLowStock],
    queryFn: async () => {
      try {
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
          throw new Error("Failed to fetch inventory items");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        return [];
      }
    },
  });

  // Filter out category placeholders and calculate low stock items
  const inventoryItems = useMemo(() => {
    return items.filter((item) => !item.isCategory) || [];
  }, [items]);

  const lowStockItems = useMemo(() => {
    return (
      inventoryItems.filter((item) => item.stockQuantity <= item.minStock) || []
    );
  }, [inventoryItems]);

  // Create inventory item mutation
  const createInventoryItem = useMutation({
    mutationFn: async (newItem: NewInventoryItem) => {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
    },
  });

  // Delete inventory item mutation
  const deleteInventoryItem = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete item");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return {
    inventoryItems,
    isLoading: isLoadingItems || isLoadingCategories,
    error: itemsError || categoriesError,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showLowStock,
    setShowLowStock,
    createInventoryItem,
    deleteInventoryItem,
    lowStockItems,
    isLoadingCategories,
  };
}
