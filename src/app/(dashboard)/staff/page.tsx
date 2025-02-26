"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff, NewStaffMember } from "@/hooks/use-staff";
import { useStaffForm } from "@/hooks/use-staff-form";
import {
  useStaffPermissions,
  StaffPermission,
} from "@/hooks/use-staff-permissions";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function StaffPage() {
  // Get staff data and operations
  const {
    staffMembers,
    isLoading,
    error,
    filterRole,
    setFilterRole,
    searchQuery,
    setSearchQuery,
    createStaff,
    isCreatingStaff,
    updateStaff,
    isUpdatingStaff,
    deleteStaff,
    isDeletingStaff,
  } = useStaff();

  // Check permissions
  const { canViewStaff, canCreateStaff, canEditStaff, canDeleteStaff } =
    useStaffPermissions();

  // State for the new staff modal
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Staff form hook
  const {
    staff,
    setStaff,
    handleInputChange,
    handleNestedInputChange,
    handleDeepNestedInputChange,
    handleWorkingHoursChange,
    resetForm,
  } = useStaffForm();

  const { toast } = useToast();

  // Add these state variables for edit functionality
  const [editStaffModalOpen, setEditStaffModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<string | null>(null);

  // Handle staff creation
  const handleCreateStaff = () => {
    if (!staff.name || !staff.email || !staff.role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Cast to NewStaffMember to ensure password is included
    const newStaff = staff as NewStaffMember;

    createStaff(newStaff, {
      onSuccess: () => {
        setNewStaffModalOpen(false);
        resetForm();
        toast({
          title: "Success",
          description: "Staff member created successfully",
        });
      },
    });
  };

  // Handle staff deletion
  const handleDeleteStaff = (id: string, name: string) => {
    setStaffToDelete({ id, name });
    setDeleteConfirmModalOpen(true);
  };

  const confirmDeleteStaff = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete.id, {
        onSuccess: () => {
          setDeleteConfirmModalOpen(false);
          setStaffToDelete(null);
          toast({
            title: "Success",
            description: "Staff member deleted successfully",
          });
        },
      });
    }
  };

  // Handle password input change separately
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Use type assertion to tell TypeScript that we're working with NewStaffMember
    const newStaff = { ...staff } as NewStaffMember;
    newStaff.password = value;
    // Update the staff state
    resetForm();
    // @ts-ignore - This is a workaround for the type issue
    staff.password = value;
  };

  // Function to handle opening the edit modal
  const handleEditStaff = (staffId: string) => {
    // Find the staff member to edit
    const staffMember = staffMembers.find((s) => s.id === staffId);
    if (staffMember) {
      // Set the form state with the staff member's data
      setStaff(staffMember);
      setStaffToEdit(staffId);
      setEditStaffModalOpen(true);
    }
  };

  // Function to handle the edit submission
  const handleUpdateStaff = () => {
    if (!staffToEdit || !staff.name || !staff.email || !staff.role) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    updateStaff(
      {
        id: staffToEdit,
        data: staff,
      },
      {
        onSuccess: () => {
          setEditStaffModalOpen(false);
          setStaffToEdit(null);
          resetForm();
        },
      }
    );
  };

  // If the user doesn't have permission to view staff
  if (!canViewStaff) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          You don't have permission to view the staff management page.
        </p>
        <Button asChild>
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage your organization's staff members
          </p>
        </div>
        {canCreateStaff && (
          <Button onClick={() => setNewStaffModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search staff..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="DOCTOR">Doctor</SelectItem>
                    <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{staffMembers.length} Staff</span>
                </Badge>
                <Badge variant="outline" className="flex gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>
                    {staffMembers.filter((s) => s.status === "active").length}{" "}
                    Active
                  </span>
                </Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                Error loading staff data. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No staff members found.{" "}
                        {canCreateStaff &&
                          "Add your first staff member to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback>{staff.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              {staff.specialty && (
                                <div className="text-sm text-gray-500">
                                  {staff.specialty}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              staff.role === "SUPER_ADMIN"
                                ? "default"
                                : staff.role === "ADMIN"
                                  ? "secondary"
                                  : staff.role === "DOCTOR"
                                    ? "outline"
                                    : "outline"
                            }
                          >
                            {staff.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              staff.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              staff.status === "active" ? "bg-green-500" : ""
                            }
                          >
                            {staff.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canEditStaff && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditStaff(staff.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDeleteStaff && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteStaff(staff.id, staff.name)
                                }
                                disabled={isDeletingStaff}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Staff Modal */}
      <Dialog open={newStaffModalOpen} onOpenChange={setNewStaffModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-background z-10">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Details</TabsTrigger>
              <TabsTrigger value="work">Work & Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={staff.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={staff.role}
                    onValueChange={(value) => {
                      handleInputChange({
                        target: { name: "role", value },
                      } as any);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DOCTOR">Doctor</SelectItem>
                      <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={staff.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={staff.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={staff.status}
                    onValueChange={(value) => {
                      handleInputChange({
                        target: { name: "status", value },
                      } as any);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={staff.specialty || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={staff.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={staff.joinDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={staff.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={staff.notes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Emergency Contact</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      name="name"
                      value={staff.emergencyContact.name}
                      onChange={(e) =>
                        handleNestedInputChange(e, "emergencyContact")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      name="relationship"
                      value={staff.emergencyContact.relationship}
                      onChange={(e) =>
                        handleNestedInputChange(e, "emergencyContact")
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="phone"
                      value={staff.emergencyContact.phone}
                      onChange={(e) =>
                        handleNestedInputChange(e, "emergencyContact")
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-6 py-2 pb-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Working Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Set the working days and hours for this staff member.
                </p>

                <div className="space-y-4">
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-28">
                        <Label className="capitalize font-medium">{day}</Label>
                      </div>

                      <Switch
                        checked={
                          !!staff.workingHours[
                            day as keyof typeof staff.workingHours
                          ].start
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // When enabled, set default hours (9-5)
                            handleWorkingHoursChange(day, "start", "09:00");
                            handleWorkingHoursChange(day, "end", "17:00");
                          } else {
                            // When disabled, clear hours
                            handleWorkingHoursChange(day, "start", "");
                            handleWorkingHoursChange(day, "end", "");
                          }
                        }}
                      />

                      <div className="flex-1 flex items-center gap-2">
                        <Select
                          value={
                            staff.workingHours[
                              day as keyof typeof staff.workingHours
                            ].start
                          }
                          onValueChange={(value) =>
                            handleWorkingHoursChange(day, "start", value)
                          }
                          disabled={
                            !staff.workingHours[
                              day as keyof typeof staff.workingHours
                            ].start
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="09:00" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "08:00",
                              "08:30",
                              "09:00",
                              "09:30",
                              "10:00",
                              "10:30",
                              "11:00",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={
                            staff.workingHours[
                              day as keyof typeof staff.workingHours
                            ].end
                          }
                          onValueChange={(value) =>
                            handleWorkingHoursChange(day, "end", value)
                          }
                          disabled={
                            !staff.workingHours[
                              day as keyof typeof staff.workingHours
                            ].start
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="17:00" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "16:00",
                              "16:30",
                              "17:00",
                              "17:30",
                              "18:00",
                              "18:30",
                              "19:00",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Set standard 9-5 hours for weekdays
                      const standardHours = {
                        monday: { start: "09:00", end: "17:00" },
                        tuesday: { start: "09:00", end: "17:00" },
                        wednesday: { start: "09:00", end: "17:00" },
                        thursday: { start: "09:00", end: "17:00" },
                        friday: { start: "09:00", end: "17:00" },
                        saturday: { start: "", end: "" },
                        sunday: { start: "", end: "" },
                      };

                      // Update all working hours at once
                      Object.entries(standardHours).forEach(([day, hours]) => {
                        handleWorkingHoursChange(day, "start", hours.start);
                        handleWorkingHoursChange(day, "end", hours.end);
                      });
                    }}
                  >
                    Set Standard Hours
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Clear all hours
                      const emptyHours = {
                        monday: { start: "", end: "" },
                        tuesday: { start: "", end: "" },
                        wednesday: { start: "", end: "" },
                        thursday: { start: "", end: "" },
                        friday: { start: "", end: "" },
                        saturday: { start: "", end: "" },
                        sunday: { start: "", end: "" },
                      };

                      // Update all working hours at once
                      Object.entries(emptyHours).forEach(([day, hours]) => {
                        handleWorkingHoursChange(day, "start", hours.start);
                        handleWorkingHoursChange(day, "end", hours.end);
                      });
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Payroll Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      value={staff.payroll.salary.toString()}
                      onChange={(e) => handleNestedInputChange(e, "payroll")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <Select
                      value={staff.payroll.paymentFrequency}
                      onValueChange={(value) => {
                        handleNestedInputChange(
                          {
                            target: { name: "paymentFrequency", value },
                          } as any,
                          "payroll"
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Biweekly">Biweekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        value={staff.payroll.bankDetails.accountName}
                        onChange={(e) =>
                          handleDeepNestedInputChange(
                            e,
                            "payroll",
                            "bankDetails"
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={staff.payroll.bankDetails.accountNumber}
                        onChange={(e) =>
                          handleDeepNestedInputChange(
                            e,
                            "payroll",
                            "bankDetails"
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={staff.payroll.bankDetails.bankName}
                        onChange={(e) =>
                          handleDeepNestedInputChange(
                            e,
                            "payroll",
                            "bankDetails"
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sticky bottom-0 bg-background pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewStaffModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStaff} disabled={isCreatingStaff}>
              {isCreatingStaff ? "Creating..." : "Create Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmModalOpen}
        onOpenChange={setDeleteConfirmModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <strong>{staffToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteStaff}
              disabled={isDeletingStaff}
            >
              {isDeletingStaff ? "Deleting..." : "Delete Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Modal */}
      <Dialog open={editStaffModalOpen} onOpenChange={setEditStaffModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-background z-10">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="payroll">Work & Payroll</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={staff.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={staff.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={staff.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={staff.role}
                      onValueChange={(value) => {
                        handleInputChange({
                          target: { name: "role", value },
                        } as any);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DOCTOR">Doctor</SelectItem>
                        <SelectItem value="RECEPTIONIST">
                          Receptionist
                        </SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={staff.status}
                      onValueChange={(value) => {
                        handleInputChange({
                          target: { name: "status", value },
                        } as any);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={staff.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Name</Label>
                      <Input
                        id="emergencyName"
                        name="name"
                        value={staff.emergencyContact.name}
                        onChange={(e) =>
                          handleNestedInputChange(e, "emergencyContact")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">
                        Relationship
                      </Label>
                      <Input
                        id="emergencyRelationship"
                        name="relationship"
                        value={staff.emergencyContact.relationship}
                        onChange={(e) =>
                          handleNestedInputChange(e, "emergencyContact")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Phone</Label>
                      <Input
                        id="emergencyPhone"
                        name="phone"
                        value={staff.emergencyContact.phone}
                        onChange={(e) =>
                          handleNestedInputChange(e, "emergencyContact")
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payroll">
              <div className="space-y-6 py-2 pb-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Working Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Set the working days and hours for this staff member.
                  </p>

                  <div className="space-y-4">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-28">
                          <Label className="capitalize font-medium">
                            {day}
                          </Label>
                        </div>

                        <Switch
                          checked={
                            !!staff.workingHours[
                              day as keyof typeof staff.workingHours
                            ].start
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // When enabled, set default hours (9-5)
                              handleWorkingHoursChange(day, "start", "09:00");
                              handleWorkingHoursChange(day, "end", "17:00");
                            } else {
                              // When disabled, clear hours
                              handleWorkingHoursChange(day, "start", "");
                              handleWorkingHoursChange(day, "end", "");
                            }
                          }}
                        />

                        <div className="flex-1 flex items-center gap-2">
                          <Select
                            value={
                              staff.workingHours[
                                day as keyof typeof staff.workingHours
                              ].start
                            }
                            onValueChange={(value) =>
                              handleWorkingHoursChange(day, "start", value)
                            }
                            disabled={
                              !staff.workingHours[
                                day as keyof typeof staff.workingHours
                              ].start
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="09:00" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "08:00",
                                "08:30",
                                "09:00",
                                "09:30",
                                "10:00",
                                "10:30",
                                "11:00",
                              ].map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={
                              staff.workingHours[
                                day as keyof typeof staff.workingHours
                              ].end
                            }
                            onValueChange={(value) =>
                              handleWorkingHoursChange(day, "end", value)
                            }
                            disabled={
                              !staff.workingHours[
                                day as keyof typeof staff.workingHours
                              ].start
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="17:00" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "16:00",
                                "16:30",
                                "17:00",
                                "17:30",
                                "18:00",
                                "18:30",
                                "19:00",
                              ].map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Set standard 9-5 hours for weekdays
                        const standardHours = {
                          monday: { start: "09:00", end: "17:00" },
                          tuesday: { start: "09:00", end: "17:00" },
                          wednesday: { start: "09:00", end: "17:00" },
                          thursday: { start: "09:00", end: "17:00" },
                          friday: { start: "09:00", end: "17:00" },
                          saturday: { start: "", end: "" },
                          sunday: { start: "", end: "" },
                        };

                        // Update all working hours at once
                        Object.entries(standardHours).forEach(
                          ([day, hours]) => {
                            handleWorkingHoursChange(day, "start", hours.start);
                            handleWorkingHoursChange(day, "end", hours.end);
                          }
                        );
                      }}
                    >
                      Set Standard Hours
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear all hours
                        const emptyHours = {
                          monday: { start: "", end: "" },
                          tuesday: { start: "", end: "" },
                          wednesday: { start: "", end: "" },
                          thursday: { start: "", end: "" },
                          friday: { start: "", end: "" },
                          saturday: { start: "", end: "" },
                          sunday: { start: "", end: "" },
                        };

                        // Update all working hours at once
                        Object.entries(emptyHours).forEach(([day, hours]) => {
                          handleWorkingHoursChange(day, "start", hours.start);
                          handleWorkingHoursChange(day, "end", hours.end);
                        });
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        name="salary"
                        type="number"
                        value={staff.payroll.salary.toString()}
                        onChange={(e) => handleNestedInputChange(e, "payroll")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">
                        Payment Frequency
                      </Label>
                      <Select
                        value={staff.payroll.paymentFrequency}
                        onValueChange={(value) => {
                          handleNestedInputChange(
                            {
                              target: { name: "paymentFrequency", value },
                            } as any,
                            "payroll"
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Biweekly">Biweekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium">Bank Details</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          name="accountName"
                          value={staff.payroll.bankDetails.accountName}
                          onChange={(e) =>
                            handleDeepNestedInputChange(
                              e,
                              "payroll",
                              "bankDetails"
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          name="accountNumber"
                          value={staff.payroll.bankDetails.accountNumber}
                          onChange={(e) =>
                            handleDeepNestedInputChange(
                              e,
                              "payroll",
                              "bankDetails"
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          name="bankName"
                          value={staff.payroll.bankDetails.bankName}
                          onChange={(e) =>
                            handleDeepNestedInputChange(
                              e,
                              "payroll",
                              "bankDetails"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sticky bottom-0 bg-background pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditStaffModalOpen(false);
                setStaffToEdit(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStaff} disabled={isUpdatingStaff}>
              {isUpdatingStaff ? "Updating..." : "Update Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
