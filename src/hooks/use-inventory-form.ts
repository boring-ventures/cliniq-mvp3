import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { InventoryItem, NewInventoryItem } from "./use-inventory";

// Initial state for a new inventory item
const initialState: NewInventoryItem = {
  name: "",
  category: "",
  description: "",
  quantity: 0,
  unit: "pcs",
  minStock: 10,
  supplier: "",
  price: 0,
};

export function useInventoryForm(existingItem?: InventoryItem) {
  const queryClient = useQueryClient();
  // Initialize state with existing item data or default values
  const [formData, setFormData] = useState<NewInventoryItem>(
    existingItem
      ? {
          name: existingItem.name,
          category: existingItem.category,
          description: existingItem.description || "",
          quantity: existingItem.stockQuantity,
          unit: existingItem.unit,
          minStock: existingItem.minStock,
          supplier: existingItem.supplier || "",
          price: Number(existingItem.price),
        }
      : initialState
  );

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" || name === "minStock" || name === "price"
        ? Number(value)
        : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form to initial state or existing item
  const resetForm = () => {
    setFormData(initialState);
  };

  // Validate form data
  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name) errors.push("Name is required");
    if (!formData.category) errors.push("Category is required");
    if (formData.quantity < 0) errors.push("Quantity cannot be negative");
    if (formData.minStock < 0) errors.push("Minimum stock cannot be negative");
    if (formData.price < 0) errors.push("Price cannot be negative");

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // Format numeric values for form inputs to prevent NaN
  const getInputValue = (field: keyof NewInventoryItem) => {
    const value = formData[field];
    if (typeof value === "number") {
      return value.toString();
    }
    return value || "";
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSelectChange,
    resetForm,
    validateForm,
    getInputValue,
  };
}
