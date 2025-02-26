import { useState } from "react";
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
  // Initialize state with existing item data or default values
  const [formData, setFormData] = useState<NewInventoryItem>(
    existingItem
      ? {
          name: existingItem.name,
          category: existingItem.category,
          description: existingItem.description || "",
          quantity: existingItem.stockQuantity || 0,
          unit: existingItem.unit || "pcs",
          minStock: existingItem.minStock || 10,
          supplier: existingItem.supplier || "",
          price: Number(existingItem.price) || 0,
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

    // Handle numeric fields
    if (name === "quantity" || name === "minStock" || name === "price") {
      const numValue = value === "" ? 0 : Number(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Reset form to initial state or existing item
  const resetForm = () => {
    setFormData(
      existingItem
        ? {
            name: existingItem.name,
            category: existingItem.category,
            description: existingItem.description || "",
            quantity: existingItem.stockQuantity || 0,
            unit: existingItem.unit || "pcs",
            minStock: existingItem.minStock || 10,
            supplier: existingItem.supplier || "",
            price: Number(existingItem.price) || 0,
          }
        : initialState
    );
  };

  // Validate form data
  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Name is required");
    }

    if (!formData.category.trim()) {
      errors.push("Category is required");
    }

    if (formData.quantity < 0) {
      errors.push("Quantity cannot be negative");
    }

    if (formData.minStock < 0) {
      errors.push("Minimum stock level cannot be negative");
    }

    if (formData.price < 0) {
      errors.push("Price cannot be negative");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // Format numeric values for form inputs to prevent NaN
  const getInputValue = (field: keyof NewInventoryItem) => {
    const value = formData[field];
    if (typeof value === "number") {
      return isNaN(value) ? "" : value.toString();
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
