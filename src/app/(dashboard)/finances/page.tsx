"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  ArrowLeft,
  X,
  Check,
  Clock,
  MoreVertical,
  Download,
  Send,
  ArrowDown,
  Eye,
  Printer,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock invoice data
const invoices = [
  {
    id: "INV-001",
    patientName: "Sarah Thompson",
    date: "2024-03-10",
    dueDate: "2024-03-25",
    amount: 350.0,
    status: "Paid",
    paymentMethod: "Credit Card",
    paymentDate: "2024-03-10",
    items: [
      { id: "1", description: "Dental Check-up", quantity: 1, price: 150.0 },
      { id: "2", description: "X-Ray", quantity: 1, price: 200.0 },
    ],
    notes: "Regular check-up and preventive care",
    doctor: "Dr. Sarah Wilson",
  },
  {
    id: "INV-002",
    patientName: "Michael Rodriguez",
    date: "2024-03-08",
    dueDate: "2024-03-23",
    amount: 450.0,
    status: "Pending",
    paymentMethod: "",
    paymentDate: "",
    items: [
      {
        id: "1",
        description: "Root Canal Treatment",
        quantity: 1,
        price: 450.0,
      },
    ],
    notes: "Emergency treatment for tooth pain",
    doctor: "Dr. Michael Chen",
  },
  {
    id: "INV-003",
    patientName: "Emma Davis",
    date: "2024-03-05",
    dueDate: "2024-03-20",
    amount: 750.0,
    status: "Overdue",
    paymentMethod: "",
    paymentDate: "",
    items: [
      { id: "1", description: "Dental Crown", quantity: 1, price: 600.0 },
      { id: "2", description: "Anesthesia", quantity: 1, price: 150.0 },
    ],
    notes: "Crown replacement for broken tooth",
    doctor: "Dr. Sarah Wilson",
  },
  {
    id: "INV-004",
    patientName: "James Wilson",
    date: "2024-03-01",
    dueDate: "2024-03-16",
    amount: 250.0,
    status: "Paid",
    paymentMethod: "Cash",
    paymentDate: "2024-03-01",
    items: [
      { id: "1", description: "Teeth Whitening", quantity: 1, price: 250.0 },
    ],
    notes: "Cosmetic procedure",
    doctor: "Dr. Michael Chen",
  },
  {
    id: "INV-005",
    patientName: "Olivia Brown",
    date: "2024-02-28",
    dueDate: "2024-03-14",
    amount: 1200.0,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    paymentDate: "2024-03-05",
    items: [
      { id: "1", description: "Dental Implant", quantity: 1, price: 1000.0 },
      { id: "2", description: "Consultation", quantity: 1, price: 200.0 },
    ],
    notes: "First stage of implant procedure",
    doctor: "Dr. Sarah Wilson",
  },
];

// Mock expense data
const expenses = [
  {
    id: "EXP-001",
    category: "Supplies",
    vendor: "Dental Supplies Co.",
    date: "2024-03-08",
    amount: 1250.0,
    status: "Paid",
    paymentMethod: "Credit Card",
    description: "Monthly dental supplies order",
  },
  {
    id: "EXP-002",
    category: "Equipment",
    vendor: "Medical Equipment Inc.",
    date: "2024-03-05",
    amount: 3500.0,
    status: "Pending",
    paymentMethod: "",
    description: "New dental chair",
  },
  {
    id: "EXP-003",
    category: "Utilities",
    vendor: "City Power & Water",
    date: "2024-03-01",
    amount: 450.0,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    description: "Monthly utilities",
  },
  {
    id: "EXP-004",
    category: "Rent",
    vendor: "Midtown Properties",
    date: "2024-03-01",
    amount: 2800.0,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    description: "Office space monthly rent",
  },
  {
    id: "EXP-005",
    category: "Staff",
    vendor: "Payroll Services",
    date: "2024-02-28",
    amount: 12500.0,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    description: "Staff salaries for February",
  },
];

export default function FinancesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("invoices");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceOpen(true);
  };

  const handleStatusChange = (invoiceId, newStatus) => {
    // In a real app, you would update the backend
    // This would update all invoices in the state
    invoices.map((invoice) =>
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    );

    // Update the selected invoice if it's open
    if (selectedInvoice && selectedInvoice.id === invoiceId) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus });
    }
  };

  const handlePrintInvoice = () => {
    // In a real app, this would trigger a print dialog
    console.log("Printing invoice:", selectedInvoice.id);
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would download a PDF
    console.log("Downloading invoice:", selectedInvoice.id);
  };

  const handleSendInvoice = () => {
    // In a real app, this would send the invoice via email
    console.log("Sending invoice:", selectedInvoice.id);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-900 text-green-100 border-green-700 hover:bg-green-900";
      case "Pending":
        return "bg-yellow-900 text-yellow-100 border-yellow-700 hover:bg-yellow-900";
      case "Overdue":
        return "bg-red-900 text-red-100 border-red-700 hover:bg-red-900";
      default:
        return "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-900";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <Check className="h-4 w-4 mr-2" />;
      case "Pending":
        return <Clock className="h-4 w-4 mr-2" />;
      case "Overdue":
        return <X className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Filter invoices based on search query, status, and date range
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || invoice.status === filterStatus;

    // Date filtering logic would go here in a real app
    // For now, we'll just return true for all date ranges
    const matchesDate = true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filter expenses based on search query
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate financial metrics
  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );
  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingRevenue = invoices
    .filter(
      (invoice) => invoice.status === "Pending" || invoice.status === "Overdue"
    )
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Finances</h1>
        <Button onClick={() => setNewInvoiceOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="text-2xl font-bold mt-1">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="bg-green-900 p-3 rounded-full">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Paid Invoices</span>
              <span className="text-2xl font-bold mt-1">
                ${paidRevenue.toLocaleString()}
              </span>
            </div>
            <div className="bg-blue-900 p-3 rounded-full">
              <Check className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Pending Invoices</span>
              <span className="text-2xl font-bold mt-1">
                ${pendingRevenue.toLocaleString()}
              </span>
            </div>
            <div className="bg-yellow-900 p-3 rounded-full">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Expenses</span>
              <span className="text-2xl font-bold mt-1">
                ${totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="bg-red-900 p-3 rounded-full">
              <ArrowDown className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search invoices or expenses..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for Invoices and Expenses */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-white bg-black hover:bg-gray-800 rounded-md px-4 py-1 text-xs font-medium"
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense #</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        {expense.id}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell>
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>${expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(expense.status)}>
                          {getStatusIcon(expense.status)}
                          {expense.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Modal */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent className="max-w-4xl bg-black text-white">
          <DialogHeader className="flex flex-row items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white"
              onClick={() => setInvoiceOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Invoice Details</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedInvoice.id}</h2>
                  <p className="text-gray-400">
                    Created on{" "}
                    {format(new Date(selectedInvoice.date), "MMMM dd, yyyy")}
                  </p>
                </div>
                <Badge className={getStatusBadgeClass(selectedInvoice.status)}>
                  {getStatusIcon(selectedInvoice.status)}
                  {selectedInvoice.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Patient
                  </h3>
                  <p className="font-medium">{selectedInvoice.patientName}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Doctor
                  </h3>
                  <p className="font-medium">{selectedInvoice.doctor}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    Due Date
                  </h3>
                  <p className="font-medium">
                    {format(new Date(selectedInvoice.dueDate), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">
                    {selectedInvoice.status === "Paid"
                      ? "Payment Date"
                      : "Payment Method"}
                  </h3>
                  <p className="font-medium">
                    {selectedInvoice.status === "Paid"
                      ? format(
                          new Date(selectedInvoice.paymentDate),
                          "MMMM dd, yyyy"
                        )
                      : "Not paid yet"}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Invoice Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-700">
                      <TableHead className="text-white">Description</TableHead>
                      <TableHead className="text-white text-right">
                        Quantity
                      </TableHead>
                      <TableHead className="text-white text-right">
                        Price
                      </TableHead>
                      <TableHead className="text-white text-right">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-gray-700"
                      >
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.quantity * item.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${selectedInvoice.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {selectedInvoice.notes && (
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Notes</h3>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintInvoice}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadInvoice}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendInvoice}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send to Patient
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm">
                        <MoreVertical className="mr-2 h-4 w-4" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-gray-900 text-white border-gray-800"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(selectedInvoice.id, "Paid")
                        }
                        className="flex items-center cursor-pointer hover:bg-gray-800"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        <span>Mark as Paid</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(selectedInvoice.id, "Pending")
                        }
                        className="flex items-center cursor-pointer hover:bg-gray-800"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Mark as Pending</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(selectedInvoice.id, "Overdue")
                        }
                        className="flex items-center cursor-pointer hover:bg-gray-800"
                      >
                        <X className="mr-2 h-4 w-4" />
                        <span>Mark as Overdue</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Invoice Modal */}
      <Dialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen}>
        <DialogContent className="max-w-4xl bg-black text-white">
          <DialogHeader className="flex flex-row items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white"
              onClick={() => setNewInvoiceOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Create New Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-400 mb-1">
                  Patient
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Thompson</SelectItem>
                    <SelectItem value="michael">Michael Rodriguez</SelectItem>
                    <SelectItem value="emma">Emma Davis</SelectItem>
                    <SelectItem value="james">James Wilson</SelectItem>
                    <SelectItem value="olivia">Olivia Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-400 mb-1">
                  Doctor
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Dr. Sarah Wilson</SelectItem>
                    <SelectItem value="michael">Dr. Michael Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-400 mb-1">
                  Invoice Date
                </Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-400 mb-1">
                  Due Date
                </Label>
                <Input
                  type="date"
                  defaultValue={
                    new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Invoice Items</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Label className="text-sm font-medium text-gray-400">
                      Description
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-400">
                      Quantity
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-400">
                      Price ($)
                    </Label>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-400">
                      Total
                    </Label>
                  </div>
                </div>

                {/* Item row 1 */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Dental Check-up</SelectItem>
                        <SelectItem value="cleaning">Teeth Cleaning</SelectItem>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="filling">Cavity Filling</SelectItem>
                        <SelectItem value="root-canal">Root Canal</SelectItem>
                        <SelectItem value="crown">Dental Crown</SelectItem>
                        <SelectItem value="whitening">
                          Teeth Whitening
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="150.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="border rounded-md p-2 text-right">
                      $150.00
                    </div>
                  </div>
                </div>

                {/* Item row 2 */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Dental Check-up</SelectItem>
                        <SelectItem value="cleaning">Teeth Cleaning</SelectItem>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="filling">Cavity Filling</SelectItem>
                        <SelectItem value="root-canal">Root Canal</SelectItem>
                        <SelectItem value="crown">Dental Crown</SelectItem>
                        <SelectItem value="whitening">
                          Teeth Whitening
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" min="1" defaultValue="1" />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue="0.00"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="border rounded-md p-2 text-right">
                      $0.00
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>

                <div className="flex justify-end mt-4">
                  <div className="w-1/3 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (0%):</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>$150.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-400 mb-1">
                Notes
              </Label>
              <Textarea
                placeholder="Add any additional notes or payment instructions..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setNewInvoiceOpen(false)}
              >
                Cancel
              </Button>
              <Button>Save Invoice</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
