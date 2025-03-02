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
import { useStaffForm, defaultFormData } from "@/hooks/use-staff-form";
import {
  useStaffPermissions,
  StaffPermission,
} from "@/hooks/use-staff-permissions";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

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
    formData,
    handleInputChange,
    handleWorkingHoursChange,
    handleEmergencyContactChange,
    submitForm,
    isCreating,
    addQualification,
    removeQualification,
    setFormData,
  } = useStaffForm();

  const { toast } = useToast();

  // Add these state variables for edit functionality
  const [editStaffModalOpen, setEditStaffModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<string | null>(null);

  const router = useRouter();

  // Handle staff creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm();
      setNewStaffModalOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
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

  // Add near other handler functions
  const handleEditStaff = (id: string) => {
    setStaffToEdit(id);
    setEditStaffModalOpen(true);
    const staffMember = staffMembers?.find(
      (staff: StaffMember) => staff.id === id
    );
    if (staffMember) {
      // Transform working hours from object to array format
      const workingHours = Object.entries(staffMember.workingHours).map(
        ([day, hours]: [string, { start: string; end: string }]) => ({
          dayOfWeek: day.toUpperCase(),
          startTime: hours.start,
          endTime: hours.end,
        })
      );

      setFormData({
        ...defaultFormData,
        email: staffMember.email,
        firstName: staffMember.name.split(" ")[0],
        lastName: staffMember.name.split(" ")[1] || "",
        role: staffMember.role as any,
        specialty: staffMember.specialty,
        phone: staffMember.phone,
        status: staffMember.status as "active" | "inactive",
        workingHours,
        payroll: staffMember.payroll,
      });
    }
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
                  <span>{staffMembers?.length || 0} Staff</span>
                </Badge>
                <Badge variant="outline" className="flex gap-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>
                    {staffMembers?.filter((s: any) => s.status === "active")
                      .length || 0}{" "}
                    Active
                  </span>
                </Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading staff data...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-500 mb-2">Error loading staff data</p>
                <Button onClick={() => router.refresh()}>Try Again</Button>
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
                  {!isLoading &&
                  !error &&
                  staffMembers &&
                  staffMembers.length > 0 ? (
                    staffMembers.map((staff: any) => (
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
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No staff members found
                      </TableCell>
                    </TableRow>
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
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
                    value={formData.specialty || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
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
                      value={formData.emergencyContact?.name}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      name="relationship"
                      value={formData.emergencyContact?.relationship}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="phone"
                      value={formData.emergencyContact?.phone}
                      onChange={handleEmergencyContactChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="work">
              <div className="space-y-6">
                {/* Working Hours Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Working Hours</h3>
                  <div className="space-y-4">
                    {[
                      "MONDAY",
                      "TUESDAY",
                      "WEDNESDAY",
                      "THURSDAY",
                      "FRIDAY",
                      "SATURDAY",
                      "SUNDAY",
                    ].map((day, index) => (
                      <div
                        key={day}
                        className="grid grid-cols-[120px,1fr,1fr] gap-4 items-center"
                      >
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={
                              !!formData.workingHours?.[index]?.startTime
                            }
                            onCheckedChange={(checked) => {
                              const newTime = checked ? "09:00" : "";
                              handleWorkingHoursChange(
                                index,
                                "startTime",
                                newTime
                              );
                              handleWorkingHoursChange(
                                index,
                                "endTime",
                                checked ? "17:00" : ""
                              );
                            }}
                          />
                          <span>
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <Select
                          value={
                            formData.workingHours?.[index]?.startTime || ""
                          }
                          onValueChange={(value) =>
                            handleWorkingHoursChange(index, "startTime", value)
                          }
                          disabled={!formData.workingHours?.[index]?.startTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Start Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return [`${hour}:00`, `${hour}:30`];
                            })
                              .flat()
                              .map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={formData.workingHours?.[index]?.endTime || ""}
                          onValueChange={(value) =>
                            handleWorkingHoursChange(index, "endTime", value)
                          }
                          disabled={!formData.workingHours?.[index]?.startTime}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="End Time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return [`${hour}:00`, `${hour}:30`];
                            })
                              .flat()
                              .map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payroll Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payroll Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={formData.payroll?.salary || 0}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          handleInputChange({
                            target: {
                              name: "payroll",
                              value: {
                                ...formData.payroll,
                                salary: isNaN(value) ? 0 : value,
                              },
                            },
                          } as any);
                        }}
                        placeholder="Enter salary amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentFrequency">
                        Payment Frequency
                      </Label>
                      <Select
                        value={formData.payroll?.paymentFrequency || "Monthly"}
                        onValueChange={(value) => {
                          handleInputChange({
                            target: {
                              name: "payroll",
                              value: {
                                ...formData.payroll,
                                paymentFrequency: value,
                              },
                            },
                          } as any);
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

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Bank Details</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                          id="accountName"
                          value={
                            formData.payroll?.bankDetails?.accountName || ""
                          }
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: "payroll",
                                value: {
                                  ...formData.payroll,
                                  bankDetails: {
                                    ...formData.payroll?.bankDetails,
                                    accountName: e.target.value,
                                  },
                                },
                              },
                            } as any);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={
                            formData.payroll?.bankDetails?.accountNumber || ""
                          }
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: "payroll",
                                value: {
                                  ...formData.payroll,
                                  bankDetails: {
                                    ...formData.payroll?.bankDetails,
                                    accountNumber: e.target.value,
                                  },
                                },
                              },
                            } as any);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={formData.payroll?.bankDetails?.bankName || ""}
                          onChange={(e) => {
                            handleInputChange({
                              target: {
                                name: "payroll",
                                value: {
                                  ...formData.payroll,
                                  bankDetails: {
                                    ...formData.payroll?.bankDetails,
                                    bankName: e.target.value,
                                  },
                                },
                              },
                            } as any);
                          }}
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
                setNewStaffModalOpen(false);
                handleInputChange({
                  target: {
                    name: "firstName",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "lastName",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "email",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "password",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "phone",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "role",
                    value: "DOCTOR",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "status",
                    value: "active",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "specialty",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "dateOfBirth",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "joinDate",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "address",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "notes",
                    value: "",
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "emergencyContact",
                    value: {
                      name: "",
                      relationship: "",
                      phone: "",
                    },
                  },
                } as any);
                handleInputChange({
                  target: {
                    name: "payroll",
                    value: {
                      salary: 0,
                      paymentFrequency: "Weekly",
                      bankDetails: {
                        accountName: "",
                        accountNumber: "",
                        bankName: "",
                      },
                    },
                  },
                } as any);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Staff Member"}
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
    </div>
  );
}
