import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { InventoryItem } from "./use-inventory";

interface UsageLog {
  id: string;
  itemId: string;
  usedBy: string | null;
  quantity: number;
  usedAt: Date;
  notes: string | null;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
}

export function useInventoryItem(itemId: string | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch a single inventory item
  const {
    data: item,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["inventoryItem", itemId],
    queryFn: async () => {
      if (!itemId) return null;

      const response = await fetch(`/api/inventory/${itemId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch inventory item");
      }
      return response.json();
    },
    enabled: !!itemId,
  });

  // Fetch usage logs for the item
  const {
    data: usageLogs = [],
    isLoading: isLoadingLogs,
    error: logsError,
  } = useQuery({
    queryKey: ["inventoryLogs", itemId],
    queryFn: async () => {
      if (!itemId) return [];

      const response = await fetch(`/api/inventory/${itemId}/logs`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch usage logs");
      }
      return response.json();
    },
    enabled: !!itemId,
  });

  // Add stock to the item
  const addStock = useMutation({
    mutationFn: async ({
      quantity,
      notes,
    }: {
      quantity: number;
      notes?: string;
    }) => {
      if (!itemId) throw new Error("No item selected");

      const response = await fetch(`/api/inventory/${itemId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: Math.abs(quantity), // Ensure positive
          notes: notes || "Stock added",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add stock");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItem", itemId] });
      queryClient.invalidateQueries({ queryKey: ["inventoryLogs", itemId] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Stock added successfully",
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

  // Remove stock from the item
  const removeStock = useMutation({
    mutationFn: async ({
      quantity,
      notes,
    }: {
      quantity: number;
      notes?: string;
    }) => {
      if (!itemId) throw new Error("No item selected");

      const response = await fetch(`/api/inventory/${itemId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: -Math.abs(quantity), // Ensure negative
          notes: notes || "Stock used",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove stock");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItem", itemId] });
      queryClient.invalidateQueries({ queryKey: ["inventoryLogs", itemId] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({
        title: "Success",
        description: "Stock removed successfully",
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

  return {
    item,
    isLoading,
    error,
    usageLogs,
    isLoadingLogs,
    logsError,
    addStock,
    removeStock,
  };
} 