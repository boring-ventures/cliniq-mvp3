"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  BarChart3,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock inventory data
const inventoryItems = [
  {
    id: "1",
    name: "Dental Composite",
    category: "Restorative Materials",
    quantity: 45,
    unit: "pcs",
    minStock: 20,
    supplier: "Dental Supplies Co.",
    lastRestocked: "2024-02-15",
    price: 29.99,
  },
  {
    id: "2",
    name: "Disposable Gloves (M)",
    category: "Disposables",
    quantity: 12,
    unit: "boxes",
    minStock: 15,
    supplier: "MedEquip Inc.",
    lastRestocked: "2024-02-10",
    price: 8.5,
  },
  {
    id: "3",
    name: "Dental Anesthetic",
    category: "Medications",
    quantity: 30,
    unit: "vials",
    minStock: 10,
    supplier: "Pharma Dental",
    lastRestocked: "2024-01-28",
    price: 15.75,
  },
  {
    id: "4",
    name: "Dental Burs",
    category: "Instruments",
    quantity: 85,
    unit: "pcs",
    minStock: 30,
    supplier: "Dental Tools Ltd.",
    lastRestocked: "2024-02-05",
    price: 4.25,
  },
  {
    id: "5",
    name: "Impression Material",
    category: "Impression Materials",
    quantity: 8,
    unit: "kits",
    minStock: 5,
    supplier: "Dental Supplies Co.",
    lastRestocked: "2024-01-20",
    price: 45.0,
  },
];

// Initial categories for filtering
const initialCategories = [
  "All Categories",
  "Restorative Materials",
  "Disposables",
  "Medications",
  "Instruments",
  "Impression Materials",
];

// Initial units
const initialUnits = ["pcs", "boxes", "vials", "kits", "bottles"];

// Sample product names for autofill
const productSuggestions = [
  "Dental Composite",
  "Dental Amalgam",
  "Dental Cement",
  "Dental Burs",
  "Dental Anesthetic",
  "Disposable Gloves (S)",
  "Disposable Gloves (M)",
  "Disposable Gloves (L)",
  "Face Masks",
  "Impression Material",
  "Dental Floss",
  "Toothbrushes",
  "Dental Mirrors",
  "Dental Probes",
  "Dental Forceps",
  "Dental Syringes",
  "Dental X-Ray Films",
  "Dental Bibs",
  "Sterilization Pouches",
  "Dental Suction Tips",
];

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState(initialCategories);
  const [units, setUnits] = useState(initialUnits);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newUnitOpen, setNewUnitOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "pcs",
    minStock: 0,
    supplier: "",
    price: 0,
  });

  // Filter suggestions based on input
  useEffect(() => {
    if (newItem.name) {
      const filtered = productSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(newItem.name.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [newItem.name]);

  const handleAddItem = () => {
    setNewItemOpen(true);
    setNewItem({
      name: "",
      category: "",
      quantity: 0,
      unit: "pcs",
      minStock: 0,
      supplier: "",
      price: 0,
    });
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditItemOpen(true);
  };

  const handleSaveNewItem = () => {
    // In a real app, you would save to the backend
    console.log("Saving new item:", newItem);
    setNewItemOpen(false);
  };

  const handleUpdateItem = () => {
    // In a real app, you would update in the backend
    console.log("Updating item:", selectedItem);
    setEditItemOpen(false);
  };

  const handleInputChange = (e, isNewItem = true) => {
    const { name, value } = e.target;
    if (isNewItem) {
      setNewItem({
        ...newItem,
        [name]:
          name === "quantity" || name === "minStock" || name === "price"
            ? parseFloat(value)
            : value,
      });

      if (name === "name") {
        setShowItemSuggestions(value.length > 0);
      }
    } else {
      setSelectedItem({
        ...selectedItem,
        [name]:
          name === "quantity" || name === "minStock" || name === "price"
            ? parseFloat(value)
            : value,
      });
    }
  };

  const handleSelectChange = (value, field, isNewItem = true) => {
    if (isNewItem) {
      setNewItem({
        ...newItem,
        [field]: value,
      });
    } else {
      setSelectedItem({
        ...selectedItem,
        [field]: value,
      });
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setNewCategoryOpen(false);

      // Auto-select the new category in the form
      if (newItemOpen) {
        setNewItem({
          ...newItem,
          category: newCategory,
        });
      } else if (editItemOpen && selectedItem) {
        setSelectedItem({
          ...selectedItem,
          category: newCategory,
        });
      }
    }
  };

  const handleAddUnit = () => {
    if (newUnit && !units.includes(newUnit)) {
      setUnits([...units, newUnit]);
      setNewUnit("");
      setNewUnitOpen(false);

      // Auto-select the new unit in the form
      if (newItemOpen) {
        setNewItem({
          ...newItem,
          unit: newUnit,
        });
      } else if (editItemOpen && selectedItem) {
        setSelectedItem({
          ...selectedItem,
          unit: newUnit,
        });
      }
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setNewItem({
      ...newItem,
      name: suggestion,
    });
    setShowItemSuggestions(false);
  };

  // Filter items based on search query and selected category
  const filteredItems = inventoryItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "All Categories" ||
        item.category === selectedCategory)
  );

  // Calculate metrics
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.minStock
  ).length;
  const totalValue = inventoryItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={handleAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Items</span>
              <span className="text-2xl font-bold mt-1">{totalItems}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Low Stock Items</span>
              <span className="text-2xl font-bold mt-1">{lowStockItems}</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Value</span>
              <span className="text-2xl font-bold mt-1">
                BOB {totalValue.toFixed(2)}
              </span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <BarChart3 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Price (BOB)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {item.quantity <= item.minStock ? (
                      <Badge
                        variant="destructive"
                        className="bg-red-900 hover:bg-red-800"
                      >
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-900 hover:bg-green-800"
                      >
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add New Item Dialog */}
      <Dialog open={newItemOpen} onOpenChange={setNewItemOpen}>
        <DialogContent className="bg-black text-white border border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="name">Item Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="bg-black border-gray-700 text-white"
                    autoComplete="off"
                  />
                  {showItemSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                            onClick={() => handleSelectSuggestion(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select
                    value={newItem.category}
                    onValueChange={(value) =>
                      handleSelectChange(value, "category")
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="bg-black border-gray-700 text-white flex-1"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {categories
                        .filter((c) => c !== "All Categories")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setNewCategoryOpen(true)}
                    className="h-10 w-10 border-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <div className="flex gap-2">
                  <Select
                    value={newItem.unit}
                    onValueChange={(value) => handleSelectChange(value, "unit")}
                  >
                    <SelectTrigger
                      id="unit"
                      className="bg-black border-gray-700 text-white flex-1"
                    >
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setNewUnitOpen(true)}
                    className="h-10 w-10 border-gray-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Min Stock Level</Label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  value={newItem.minStock}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={newItem.supplier}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (BOB)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={handleInputChange}
                  className="bg-black border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewItemOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNewItem}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="bg-black text-white border border-gray-800">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={selectedItem.name}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedItem.category}
                      onValueChange={(value) =>
                        handleSelectChange(value, "category", false)
                      }
                    >
                      <SelectTrigger
                        id="edit-category"
                        className="bg-black border-gray-700 text-white flex-1"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {categories
                          .filter((c) => c !== "All Categories")
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNewCategoryOpen(true)}
                      className="h-10 w-10 border-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    name="quantity"
                    type="number"
                    value={selectedItem.quantity}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedItem.unit}
                      onValueChange={(value) =>
                        handleSelectChange(value, "unit", false)
                      }
                    >
                      <SelectTrigger
                        id="edit-unit"
                        className="bg-black border-gray-700 text-white flex-1"
                      >
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setNewUnitOpen(true)}
                      className="h-10 w-10 border-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minStock">Min Stock Level</Label>
                  <Input
                    id="edit-minStock"
                    name="minStock"
                    type="number"
                    value={selectedItem.minStock}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input
                    id="edit-supplier"
                    name="supplier"
                    value={selectedItem.supplier}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (BOB)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={selectedItem.price}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-black border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditItemOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Category Dialog */}
      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent className="bg-black text-white border border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-category">Category Name</Label>
              <Input
                id="new-category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-black border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewCategoryOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Unit Dialog */}
      <Dialog open={newUnitOpen} onOpenChange={setNewUnitOpen}>
        <DialogContent className="bg-black text-white border border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Unit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-unit">Unit Name</Label>
              <Input
                id="new-unit"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="bg-black border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewUnitOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleAddUnit}>Add Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
