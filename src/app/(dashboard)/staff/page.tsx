"use client";

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
  Save,
  X,
  Upload,
  Download,
  Eye,
  Briefcase,
  Stethoscope,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock staff data
const staffMembers = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    role: "Doctor",
    specialty: "General Dentistry",
    phone: "+1 234-567-8910",
    email: "sarah.wilson@cliniq.com",
    status: "active",
    avatar: "",
    initials: "SW",
    dateOfBirth: "1985-06-15",
    joinDate: "2020-03-10",
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "13:00" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    address: "123 Medical Drive, Suite 101, New York, NY 10001",
    emergencyContact: {
      name: "James Wilson",
      relationship: "Spouse",
      phone: "+1 234-567-8911",
    },
    qualifications: [
      {
        id: "q1",
        degree: "Doctor of Dental Surgery (DDS)",
        institution: "New York University College of Dentistry",
        year: "2015",
      },
      {
        id: "q2",
        degree: "Advanced Certification in Orthodontics",
        institution: "American Dental Association",
        year: "2017",
      },
    ],
    appointments: [
      {
        id: "a1",
        patientName: "Emma Davis",
        date: "2024-03-15",
        time: "10:00",
        status: "Scheduled",
      },
      {
        id: "a2",
        patientName: "Michael Rodriguez",
        date: "2024-03-15",
        time: "11:30",
        status: "Scheduled",
      },
      {
        id: "a3",
        patientName: "Sarah Thompson",
        date: "2024-03-16",
        time: "14:00",
        status: "Scheduled",
      },
    ],
    payroll: {
      salary: 120000,
      paymentFrequency: "Monthly",
      lastPayment: "2024-02-28",
      bankDetails: {
        accountName: "Sarah Wilson",
        accountNumber: "XXXX-XXXX-XXXX-1234",
        bankName: "Chase Bank",
      },
    },
    notes:
      "Dr. Wilson specializes in pediatric dentistry and has excellent patient rapport. She is interested in pursuing further specialization in orthodontics.",
    documents: [
      {
        id: "d1",
        name: "Medical License.pdf",
        uploadDate: "2020-03-10",
        size: "2.1 MB",
      },
      {
        id: "d2",
        name: "Contract Agreement.pdf",
        uploadDate: "2020-03-10",
        size: "1.8 MB",
      },
      {
        id: "d3",
        name: "Insurance Certificate.pdf",
        uploadDate: "2023-01-15",
        size: "1.2 MB",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    role: "Doctor",
    specialty: "Orthodontics",
    phone: "+1 234-567-8912",
    email: "michael.chen@cliniq.com",
    status: "active",
    avatar: "",
    initials: "MC",
    dateOfBirth: "1980-09-22",
    joinDate: "2019-05-15",
    workingHours: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "14:00" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    address: "456 Dental Avenue, New York, NY 10002",
    emergencyContact: {
      name: "Lisa Chen",
      relationship: "Spouse",
      phone: "+1 234-567-8913",
    },
    qualifications: [],
    appointments: [],
    payroll: {
      salary: 135000,
      paymentFrequency: "Monthly",
      lastPayment: "2024-02-28",
      bankDetails: {
        accountName: "Michael Chen",
        accountNumber: "XXXX-XXXX-XXXX-5678",
        bankName: "Bank of America",
      },
    },
    notes: "",
    documents: [],
  },
  {
    id: "3",
    name: "Jennifer Lopez",
    role: "Receptionist",
    specialty: "",
    phone: "+1 234-567-8914",
    email: "jennifer.lopez@cliniq.com",
    status: "active",
    avatar: "",
    initials: "JL",
    dateOfBirth: "1992-04-10",
    joinDate: "2021-01-05",
    workingHours: {
      monday: { start: "08:30", end: "17:30" },
      tuesday: { start: "08:30", end: "17:30" },
      wednesday: { start: "08:30", end: "17:30" },
      thursday: { start: "08:30", end: "17:30" },
      friday: { start: "08:30", end: "17:30" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    address: "789 Staff Street, Apt 3B, New York, NY 10003",
    emergencyContact: {
      name: "Maria Lopez",
      relationship: "Mother",
      phone: "+1 234-567-8915",
    },
    qualifications: [],
    appointments: [],
    payroll: {
      salary: 45000,
      paymentFrequency: "Bi-weekly",
      lastPayment: "2024-02-28",
      bankDetails: {
        accountName: "Jennifer Lopez",
        accountNumber: "XXXX-XXXX-XXXX-9012",
        bankName: "Wells Fargo",
      },
    },
    notes:
      "Jennifer is excellent with patient scheduling and has received multiple commendations for her customer service skills.",
    documents: [],
  },
  {
    id: "4",
    name: "Robert Johnson",
    role: "Dental Assistant",
    specialty: "",
    phone: "+1 234-567-8916",
    email: "robert.johnson@cliniq.com",
    status: "active",
    avatar: "",
    initials: "RJ",
    dateOfBirth: "1988-11-30",
    joinDate: "2022-06-15",
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "13:00" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    address: "321 Helper Road, New York, NY 10004",
    emergencyContact: {
      name: "Susan Johnson",
      relationship: "Sister",
      phone: "+1 234-567-8917",
    },
    qualifications: [],
    appointments: [],
    payroll: {
      salary: 52000,
      paymentFrequency: "Bi-weekly",
      lastPayment: "2024-02-28",
      bankDetails: {
        accountName: "Robert Johnson",
        accountNumber: "XXXX-XXXX-XXXX-3456",
        bankName: "Citibank",
      },
    },
    notes: "",
    documents: [],
  },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedStaff, setEditedStaff] = useState(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [staffNotes, setStaffNotes] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: "",
    name: "",
    role: "Doctor",
    specialty: "",
    phone: "",
    email: "",
    status: "active",
    avatar: "",
    initials: "",
    dateOfBirth: "",
    joinDate: new Date().toISOString().split("T")[0],
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    address: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    qualifications: [],
    appointments: [],
    payroll: {
      salary: 0,
      paymentFrequency: "Monthly",
      lastPayment: "",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
    },
    notes: "",
    documents: [],
  });

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setEditedStaff(JSON.parse(JSON.stringify(staff))); // Create a deep copy
    setStaffNotes(staff.notes || "");
    setProfileOpen(true);
    setEditMode(false);
    setEditingNotes(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // When entering edit mode, create a copy of the staff data
      setEditedStaff(JSON.parse(JSON.stringify(selectedStaff)));
    } else {
      // When canceling edit mode, revert to original data
      setEditedStaff(JSON.parse(JSON.stringify(selectedStaff)));
    }
  };

  const handleSaveChanges = () => {
    // In a real app, you would save changes to the backend here
    // For this demo, we'll just update the local state
    setSelectedStaff(editedStaff);

    // Update the staff in the staffMembers array
    const updatedStaff = staffMembers.map((s) =>
      s.id === editedStaff.id ? editedStaff : s
    );

    // Use the updatedStaff variable
    setStaffMembers(updatedStaff);

    // In a real app, you would update the global state or make an API call

    setEditMode(false);
  };

  const handleInputChange = (e, section = "basic") => {
    const { name, value } = e.target;

    if (section === "basic") {
      setEditedStaff({
        ...editedStaff,
        [name]: value,
      });
    } else if (section === "emergency") {
      setEditedStaff({
        ...editedStaff,
        emergencyContact: {
          ...editedStaff.emergencyContact,
          [name]: value,
        },
      });
    } else if (section === "payroll") {
      setEditedStaff({
        ...editedStaff,
        payroll: {
          ...editedStaff.payroll,
          [name]: name === "salary" ? Number(value) : value,
        },
      });
    } else if (section === "bankDetails") {
      setEditedStaff({
        ...editedStaff,
        payroll: {
          ...editedStaff.payroll,
          bankDetails: {
            ...editedStaff.payroll.bankDetails,
            [name]: value,
          },
        },
      });
    }
  };

  const handleWorkingHoursChange = (day, field, value) => {
    const updatedHours = { ...editedStaff.workingHours };
    updatedHours[day] = {
      ...updatedHours[day],
      [field]: value,
    };

    setEditedStaff({
      ...editedStaff,
      workingHours: updatedHours,
    });
  };

  const toggleWorkDay = (day) => {
    const updatedHours = { ...editedStaff.workingHours };

    if (updatedHours[day].start && updatedHours[day].end) {
      // If day is active, deactivate it
      updatedHours[day] = { start: "", end: "" };
    } else {
      // If day is inactive, activate it with default hours
      updatedHours[day] = { start: "09:00", end: "17:00" };
    }

    setEditedStaff({
      ...editedStaff,
      workingHours: updatedHours,
    });
  };

  const handleEditNotes = () => {
    setEditingNotes(true);
  };

  const handleCancelNotes = () => {
    setEditingNotes(false);
    setStaffNotes(selectedStaff.notes || "");
  };

  const handleSaveNotes = () => {
    // In a real app, you would save changes to the backend here
    // For this demo, we'll just update the local state
    const updatedStaff = { ...selectedStaff, notes: staffNotes };
    setSelectedStaff(updatedStaff);

    // Update the staff in the staffMembers array
    const updatedStaffMembers = staffMembers.map((s) =>
      s.id === updatedStaff.id ? updatedStaff : s
    );

    // Use the updatedStaffMembers variable
    setStaffMembers(updatedStaffMembers);

    setEditingNotes(false);
  };

  // Filter staff based on search query and role filter

  // Filter staff based on search query and role filter
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);

    const matchesRole = filterRole === "all" || staff.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "Doctor":
        return <Stethoscope className="mr-1 h-3 w-3" />;
      case "Receptionist":
        return <UserCheck className="mr-1 h-3 w-3" />;
      case "Dental Assistant":
        return <Briefcase className="mr-1 h-3 w-3" />;
      case "Office Manager":
        return <Users className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Doctor":
        return "bg-blue-500 text-white";
      case "Receptionist":
        return "bg-green-500 text-white";
      case "Dental Assistant":
        return "bg-purple-500 text-white";
      case "Office Manager":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleNewStaffInputChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;

    if (section === "emergency") {
      setNewStaff({
        ...newStaff,
        emergencyContact: {
          ...newStaff.emergencyContact,
          [name]: value,
        },
      });
    } else if (section === "payroll") {
      if (subsection === "bankDetails") {
        setNewStaff({
          ...newStaff,
          payroll: {
            ...newStaff.payroll,
            bankDetails: {
              ...newStaff.payroll.bankDetails,
              [name]: value,
            },
          },
        });
      } else {
        setNewStaff({
          ...newStaff,
          payroll: {
            ...newStaff.payroll,
            [name]: name === "salary" ? Number(value) : value,
          },
        });
      }
    } else {
      setNewStaff({
        ...newStaff,
        [name]: value,
      });
    }

    // Generate initials when name changes
    if (name === "name" && value) {
      const nameParts = value.split(" ");
      if (nameParts.length >= 2) {
        const initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
        setNewStaff((prev) => ({
          ...prev,
          initials: initials.toUpperCase(),
        }));
      }
    }
  };

  const handleNewStaffWorkingHoursChange = (day, field, value) => {
    const updatedHours = { ...newStaff.workingHours };
    updatedHours[day] = {
      ...updatedHours[day],
      [field]: value,
    };

    setNewStaff({
      ...newStaff,
      workingHours: updatedHours,
    });
  };

  const toggleNewStaffWorkDay = (day) => {
    const updatedHours = { ...newStaff.workingHours };

    if (updatedHours[day].start && updatedHours[day].end) {
      // If day is active, deactivate it
      updatedHours[day] = { start: "", end: "" };
    } else {
      // If day is inactive, activate it with default hours
      updatedHours[day] = { start: "09:00", end: "17:00" };
    }

    setNewStaff({
      ...newStaff,
      workingHours: updatedHours,
    });
  };

  const handleCreateStaff = () => {
    // In a real app, this would send data to an API
    // For now, we'll just add it to our local array
    const newStaffWithId = {
      ...newStaff,
      id: (staffMembers.length + 1).toString(),
    };

    // Add the new staff to our array
    staffMembers.push(newStaffWithId);

    // Reset form and close modal
    setNewStaff({
      id: "",
      name: "",
      role: "Doctor",
      specialty: "",
      phone: "",
      email: "",
      status: "active",
      avatar: "",
      initials: "",
      dateOfBirth: "",
      joinDate: new Date().toISOString().split("T")[0],
      workingHours: {
        monday: { start: "09:00", end: "17:00" },
        tuesday: { start: "09:00", end: "17:00" },
        wednesday: { start: "09:00", end: "17:00" },
        thursday: { start: "09:00", end: "17:00" },
        friday: { start: "09:00", end: "17:00" },
        saturday: { start: "", end: "" },
        sunday: { start: "", end: "" },
      },
      address: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      qualifications: [],
      appointments: [],
      payroll: {
        salary: 0,
        paymentFrequency: "Monthly",
        lastPayment: "",
        bankDetails: {
          accountName: "",
          accountNumber: "",
          bankName: "",
        },
      },
      notes: "",
      documents: [],
    });

    setNewStaffModalOpen(false);

    // Force a re-render
    setSearchQuery("");
  };

  const handleAvatarUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditedStaff({
        ...editedStaff,
        avatar: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleNewStaffAvatarUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewStaff({
        ...newStaff,
        avatar: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Button onClick={() => setNewStaffModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Staff
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Staff</span>
              <span className="text-2xl font-bold mt-1">12</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Doctors</span>
              <span className="text-2xl font-bold mt-1">4</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <Stethoscope className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Support Staff</span>
              <span className="text-2xl font-bold mt-1">8</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search staff..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Doctor">Doctors</SelectItem>
            <SelectItem value="Receptionist">Receptionists</SelectItem>
            <SelectItem value="Dental Assistant">Dental Assistants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Patients Seen</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Revenue Generated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>{staff.initials}</AvatarFallback>
                      </Avatar>
                      {staff.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeClass(staff.role)}>
                      {getRoleIcon(staff.role)}
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {staff.role === "Doctor" ? "248" : "-"}
                    {staff.role === "Doctor" && (
                      <div className="text-xs text-gray-400">This month</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {staff.role === "Doctor" ? "164" : "-"}
                    {staff.role === "Doctor" && (
                      <div className="text-xs text-gray-400">This month</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {staff.role === "Doctor" ? "$24,800" : "-"}
                    {staff.role === "Doctor" && (
                      <div className="text-xs text-gray-400">This month</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewStaff(staff)}
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

      {/* Staff Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800">
          <DialogHeader className="flex flex-row items-center sticky top-0 bg-black z-10 pb-4 border-b border-gray-800">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white"
              onClick={() => setProfileOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Staff Profile</DialogTitle>
          </DialogHeader>

          {selectedStaff && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 sticky top-14 bg-black z-10 pt-4">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Personal Details
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Schedule & Availability
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="payroll"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Payroll & Finance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Basic Information</h3>
                    {editMode ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditToggle}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveChanges}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditToggle}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={
                            editMode ? editedStaff.avatar : selectedStaff.avatar
                          }
                          alt={selectedStaff.name}
                        />
                        <AvatarFallback className="text-2xl">
                          {selectedStaff.initials}
                        </AvatarFallback>
                      </Avatar>
                      {editMode && (
                        <div className="absolute bottom-0 right-0">
                          <label
                            htmlFor="avatar-upload"
                            className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-black cursor-pointer shadow-md"
                          >
                            <Upload className="h-4 w-4" />
                            <input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleAvatarUpload(e.target.files[0])
                              }
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{selectedStaff.name}</h2>
                    <Badge className={getRoleBadgeClass(selectedStaff.role)}>
                      {getRoleIcon(selectedStaff.role)}
                      {selectedStaff.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </Label>
                      {editMode ? (
                        <Input
                          name="name"
                          value={editedStaff.name}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Role
                      </Label>
                      {editMode ? (
                        <Select
                          name="role"
                          value={editedStaff.role}
                          onValueChange={(value) =>
                            setEditedStaff({ ...editedStaff, role: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Doctor">Doctor</SelectItem>
                            <SelectItem value="Receptionist">
                              Receptionist
                            </SelectItem>
                            <SelectItem value="Dental Assistant">
                              Dental Assistant
                            </SelectItem>
                            <SelectItem value="Office Manager">
                              Office Manager
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.role}
                        </div>
                      )}
                    </div>
                    {selectedStaff.role === "Doctor" && (
                      <div>
                        <Label className="text-sm font-medium text-gray-400 mb-1">
                          Specialty
                        </Label>
                        {editMode ? (
                          <Input
                            name="specialty"
                            value={editedStaff.specialty}
                            onChange={(e) => handleInputChange(e)}
                            className="mt-1"
                          />
                        ) : (
                          <div className="border rounded-md p-2">
                            {selectedStaff.specialty || "Not specified"}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Date of Birth
                      </Label>
                      {editMode ? (
                        <Input
                          name="dateOfBirth"
                          type="date"
                          value={editedStaff.dateOfBirth}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {format(
                            new Date(selectedStaff.dateOfBirth),
                            "MM/dd/yyyy"
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Join Date
                      </Label>
                      {editMode ? (
                        <Input
                          name="joinDate"
                          type="date"
                          value={editedStaff.joinDate}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {format(
                            new Date(selectedStaff.joinDate),
                            "MM/dd/yyyy"
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Phone
                      </Label>
                      {editMode ? (
                        <Input
                          name="phone"
                          value={editedStaff.phone}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Email
                      </Label>
                      {editMode ? (
                        <Input
                          name="email"
                          type="email"
                          value={editedStaff.email}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.email}
                        </div>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Address
                      </Label>
                      {editMode ? (
                        <Input
                          name="address"
                          value={editedStaff.address}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Contact Name
                      </Label>
                      {editMode ? (
                        <Input
                          name="name"
                          value={editedStaff.emergencyContact.name}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.emergencyContact.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Relationship
                      </Label>
                      {editMode ? (
                        <Input
                          name="relationship"
                          value={editedStaff.emergencyContact.relationship}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.emergencyContact.relationship}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Phone
                      </Label>
                      {editMode ? (
                        <Input
                          name="phone"
                          value={editedStaff.emergencyContact.phone}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.emergencyContact.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedStaff.role === "Doctor" && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-6">Qualifications</h3>
                    {selectedStaff.qualifications &&
                    selectedStaff.qualifications.length > 0 ? (
                      <div className="space-y-4">
                        {selectedStaff.qualifications.map((qualification) => (
                          <div
                            key={qualification.id}
                            className="border rounded-lg p-4"
                          >
                            <h4 className="font-semibold">
                              {qualification.degree}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1">
                              {qualification.institution} • {qualification.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No qualifications added yet.
                      </p>
                    )}
                    {editMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          // In a real app, this would open a form to add a qualification
                          console.log("Add qualification");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Qualification
                      </Button>
                    )}
                  </div>
                )}

                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Notes</h3>
                    {!editingNotes ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditNotes}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Notes
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelNotes}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveNotes}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  {editingNotes ? (
                    <Textarea
                      value={staffNotes}
                      onChange={(e) => setStaffNotes(e.target.value)}
                      className="min-h-[100px] bg-gray-800 text-white"
                    />
                  ) : (
                    <p className="p-3 border rounded-md bg-gray-800">
                      {selectedStaff.notes || "No notes available."}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Working Hours</h3>
                    {editMode ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Reset working hours to original state
                            setEditedStaff({
                              ...editedStaff,
                              workingHours: selectedStaff.workingHours,
                            });
                            handleEditToggle();
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveChanges}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditToggle}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Hours
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {Object.entries(
                      editMode
                        ? editedStaff.workingHours
                        : selectedStaff.workingHours
                    ).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-28 font-medium capitalize text-white">
                          {day}
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              editMode
                                ? "cursor-pointer bg-gray-700"
                                : "cursor-not-allowed bg-gray-800"
                            }`}
                            onClick={() => editMode && toggleWorkDay(day)}
                            disabled={!editMode}
                            aria-pressed={hours.start && hours.end}
                          >
                            <span
                              className={`${
                                hours.start && hours.end
                                  ? "bg-white translate-x-6"
                                  : "bg-gray-400 translate-x-1"
                              } inline-block h-4 w-4 transform rounded-full transition-transform`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            className={`border rounded p-2 w-28 ${
                              (!hours.start && !hours.end) || !editMode
                                ? "bg-gray-900 text-gray-500 cursor-not-allowed"
                                : "bg-black text-white"
                            }`}
                            value={hours.start || "09:00"}
                            onChange={(e) =>
                              editMode &&
                              handleWorkingHoursChange(
                                day,
                                "start",
                                e.target.value
                              )
                            }
                            disabled={(!hours.start && !hours.end) || !editMode}
                          >
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                          </select>

                          <span className="text-gray-400">to</span>

                          <select
                            className={`border rounded p-2 w-28 ${
                              (!hours.start && !hours.end) || !editMode
                                ? "bg-gray-900 text-gray-500 cursor-not-allowed"
                                : "bg-black text-white"
                            }`}
                            value={hours.end || "17:00"}
                            onChange={(e) =>
                              editMode &&
                              handleWorkingHoursChange(
                                day,
                                "end",
                                e.target.value
                              )
                            }
                            disabled={(!hours.start && !hours.end) || !editMode}
                          >
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Documents</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBrowseClick}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {selectedStaff.documents &&
                    selectedStaff.documents.length > 0 ? (
                      selectedStaff.documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex justify-between items-center border rounded-lg p-4"
                        >
                          <div>
                            <h4 className="font-semibold">{document.name}</h4>
                            <p className="text-sm text-gray-400">
                              Uploaded on{" "}
                              {format(
                                new Date(document.uploadDate),
                                "MMMM d, yyyy"
                              )}{" "}
                              • {document.size}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // In a real app, this would download the document
                                console.log(`Download ${document.name}`);
                              }}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No documents uploaded yet.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-6">
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Payroll Information</h3>
                    {editMode ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditToggle}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveChanges}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditToggle}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Annual Salary
                      </Label>
                      {editMode ? (
                        <Input
                          name="salary"
                          type="number"
                          value={editedStaff.payroll.salary}
                          onChange={(e) => handleInputChange(e, "payroll")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          ${selectedStaff.payroll.salary.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Payment Frequency
                      </Label>
                      {editMode ? (
                        <Select
                          value={editedStaff.payroll.paymentFrequency}
                          onValueChange={(value) =>
                            setEditedStaff({
                              ...editedStaff,
                              payroll: {
                                ...editedStaff.payroll,
                                paymentFrequency: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.payroll.paymentFrequency}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Last Payment Date
                      </Label>
                      {editMode ? (
                        <Input
                          name="lastPayment"
                          type="date"
                          value={editedStaff.payroll.lastPayment}
                          onChange={(e) => handleInputChange(e, "payroll")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {format(
                            new Date(selectedStaff.payroll.lastPayment),
                            "MMMM d, yyyy"
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-semibold mb-4">Bank Details</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Account Name
                      </Label>
                      {editMode ? (
                        <Input
                          name="accountName"
                          value={editedStaff.payroll.bankDetails.accountName}
                          onChange={(e) => handleInputChange(e, "bankDetails")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.payroll.bankDetails.accountName}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Bank Name
                      </Label>
                      {editMode ? (
                        <Input
                          name="bankName"
                          value={editedStaff.payroll.bankDetails.bankName}
                          onChange={(e) => handleInputChange(e, "bankDetails")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.payroll.bankDetails.bankName}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Account Number
                      </Label>
                      {editMode ? (
                        <Input
                          name="accountNumber"
                          value={editedStaff.payroll.bankDetails.accountNumber}
                          onChange={(e) => handleInputChange(e, "bankDetails")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedStaff.payroll.bankDetails.accountNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Payment History</h3>
                  <p className="text-center text-gray-500 py-4">
                    Payment history will be displayed here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* New Staff Modal */}
      <Dialog open={newStaffModalOpen} onOpenChange={setNewStaffModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800">
          <DialogHeader className="flex flex-row items-center sticky top-0 bg-black z-10 pb-4 border-b border-gray-800">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white"
              onClick={() => setNewStaffModalOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Add New Staff</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 sticky top-14 bg-black z-10 pt-4">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Personal Details
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Schedule & Availability
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="payroll"
                className="data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Payroll & Finance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Basic Information</h3>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={newStaff.avatar}
                        alt={newStaff.name || "New Staff"}
                      />
                      <AvatarFallback className="text-2xl">
                        {newStaff.initials || "NS"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <label
                        htmlFor="new-avatar-upload"
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-white text-black cursor-pointer shadow-md"
                      >
                        <Upload className="h-4 w-4" />
                        <input
                          id="new-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            e.target.files?.[0] &&
                            handleNewStaffAvatarUpload(e.target.files[0])
                          }
                        />
                      </label>
                    </div>
                  </div>
                  {newStaff.name && (
                    <h2 className="text-xl font-bold">{newStaff.name}</h2>
                  )}
                  {newStaff.role && (
                    <Badge className={getRoleBadgeClass(newStaff.role)}>
                      {getRoleIcon(newStaff.role)}
                      {newStaff.role}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Full Name*
                    </Label>
                    <Input
                      name="name"
                      value={newStaff.name}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Role*
                    </Label>
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) =>
                        setNewStaff({ ...newStaff, role: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Receptionist">
                          Receptionist
                        </SelectItem>
                        <SelectItem value="Dental Assistant">
                          Dental Assistant
                        </SelectItem>
                        <SelectItem value="Office Manager">
                          Office Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newStaff.role === "Doctor" && (
                    <div>
                      <Label className="text-sm font-medium text-gray-400 mb-1">
                        Specialty
                      </Label>
                      <Input
                        name="specialty"
                        value={newStaff.specialty}
                        onChange={(e) => handleNewStaffInputChange(e)}
                        className="mt-1"
                      />
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Date of Birth
                    </Label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={newStaff.dateOfBirth}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Join Date*
                    </Label>
                    <Input
                      name="joinDate"
                      type="date"
                      value={newStaff.joinDate}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Phone*
                    </Label>
                    <Input
                      name="phone"
                      value={newStaff.phone}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Email*
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Address
                    </Label>
                    <Input
                      name="address"
                      value={newStaff.address}
                      onChange={(e) => handleNewStaffInputChange(e)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Contact Name
                    </Label>
                    <Input
                      name="name"
                      value={newStaff.emergencyContact.name}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "emergency")
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Relationship
                    </Label>
                    <Input
                      name="relationship"
                      value={newStaff.emergencyContact.relationship}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "emergency")
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Phone
                    </Label>
                    <Input
                      name="phone"
                      value={newStaff.emergencyContact.phone}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "emergency")
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Notes</h3>
                <Textarea
                  name="notes"
                  value={newStaff.notes}
                  onChange={(e) => handleNewStaffInputChange(e)}
                  placeholder="Add notes about this staff member..."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Working Hours</h3>
                <div className="space-y-6">
                  {Object.entries(newStaff.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-28 font-medium capitalize text-white">
                        {day}
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer"
                          onClick={() => toggleNewStaffWorkDay(day)}
                          aria-pressed={hours.start && hours.end}
                        >
                          <span
                            className={`${
                              hours.start && hours.end
                                ? "bg-white translate-x-6"
                                : "bg-gray-400 translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full transition-transform`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          className={`border rounded p-2 w-28 ${
                            !hours.start && !hours.end
                              ? "bg-gray-900 text-gray-500 cursor-not-allowed"
                              : "bg-black text-white"
                          }`}
                          value={hours.start || "09:00"}
                          onChange={(e) =>
                            handleNewStaffWorkingHoursChange(
                              day,
                              "start",
                              e.target.value
                            )
                          }
                          disabled={!hours.start && !hours.end}
                        >
                          <option value="08:00">08:00</option>
                          <option value="08:30">08:30</option>
                          <option value="09:00">09:00</option>
                          <option value="09:30">09:30</option>
                          <option value="10:00">10:00</option>
                          <option value="10:30">10:30</option>
                          <option value="11:00">11:00</option>
                          <option value="11:30">11:30</option>
                          <option value="12:00">12:00</option>
                        </select>

                        <span className="text-gray-400">to</span>

                        <select
                          className={`border rounded p-2 w-28 ${
                            !hours.start && !hours.end
                              ? "bg-gray-900 text-gray-500 cursor-not-allowed"
                              : "bg-black text-white"
                          }`}
                          value={hours.end || "17:00"}
                          onChange={(e) =>
                            handleNewStaffWorkingHoursChange(
                              day,
                              "end",
                              e.target.value
                            )
                          }
                          disabled={!hours.start && !hours.end}
                        >
                          <option value="16:00">16:00</option>
                          <option value="16:30">16:30</option>
                          <option value="17:00">17:00</option>
                          <option value="17:30">17:30</option>
                          <option value="18:00">18:00</option>
                          <option value="18:30">18:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Documents</h3>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                <p className="text-center text-gray-500 py-4">
                  You can upload documents after creating the staff member.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="payroll" className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Payroll Information</h3>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Annual Salary*
                    </Label>
                    <Input
                      name="salary"
                      type="number"
                      value={newStaff.payroll.salary}
                      onChange={(e) => handleNewStaffInputChange(e, "payroll")}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Payment Frequency
                    </Label>
                    <Select
                      value={newStaff.payroll.paymentFrequency}
                      onValueChange={(value) =>
                        setNewStaff({
                          ...newStaff,
                          payroll: {
                            ...newStaff.payroll,
                            paymentFrequency: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h4 className="font-semibold mb-4">Bank Details</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Account Name
                    </Label>
                    <Input
                      name="accountName"
                      value={newStaff.payroll.bankDetails.accountName}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "payroll", "bankDetails")
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Bank Name
                    </Label>
                    <Input
                      name="bankName"
                      value={newStaff.payroll.bankDetails.bankName}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "payroll", "bankDetails")
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-400 mb-1">
                      Account Number
                    </Label>
                    <Input
                      name="accountNumber"
                      value={newStaff.payroll.bankDetails.accountNumber}
                      onChange={(e) =>
                        handleNewStaffInputChange(e, "payroll", "bankDetails")
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-black py-4 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => setNewStaffModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStaff}>Create Staff Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function getRoleBadgeClass(role) {
  switch (role) {
    case "Doctor":
      return "bg-blue-500 text-white";
    case "Receptionist":
      return "bg-green-500 text-white";
    case "Dental Assistant":
      return "bg-purple-500 text-white";
    case "Office Manager":
      return "bg-yellow-500 text-black";
    default:
      return "bg-gray-500 text-white";
  }
}
