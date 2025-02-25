"use client";

import { useState, useRef } from "react";
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
  Filter,
  Users,
  UserCheck,
  UserPlus,
  ArrowLeft,
  Edit,
  Save,
  X,
  Check,
  Clock,
  MoreVertical,
  Upload,
  Eye,
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

// Add this interface at the top of the file, after imports
interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  nextAppointment: string;
  status: string;
  avatar: string;
  initials: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  treatmentHistory: Array<{
    id: string;
    title: string;
    date: string;
    notes: string;
    doctor: string;
    status: string;
  }>;
  medicalNotes: string;
  files: Array<{
    id: string;
    name: string;
    uploadDate: string;
    size: string;
  }>;
  payments: Array<{
    id: string;
    invoiceId?: string;
    date: string;
    service: string;
    amount: number;
    status: string;
  }>;
}

// Rename the mock data array
const patientsData = [
  {
    id: "1",
    name: "Sarah Thompson",
    phone: "+1 234-567-8901",
    email: "sarah.t@email.com",
    lastVisit: "2024-02-20",
    nextAppointment: "2024-03-15",
    status: "active",
    avatar: "",
    initials: "ST",
    dateOfBirth: "1990-05-15",
    emergencyContact: {
      name: "John Thompson",
      relationship: "Spouse",
      phone: "+1 234-567-8902",
    },
    treatmentHistory: [
      {
        id: "1",
        title: "Dental Check-up",
        date: "2024-02-20",
        notes: "Regular cleaning performed. No cavities found.",
        doctor: "Dr. Sarah Wilson",
        status: "Completed",
      },
      {
        id: "2",
        title: "X-Ray Examination",
        date: "2024-01-15",
        notes: "Full mouth X-rays taken. Results normal.",
        doctor: "Dr. Michael Chen",
        status: "Completed",
      },
      {
        id: "3",
        title: "Cavity Filling",
        date: "2023-12-10",
        notes: "Small cavity filled in lower right molar.",
        doctor: "Dr. Sarah Wilson",
        status: "In Progress",
      },
    ],
    medicalNotes:
      "Patient has a history of mild allergies. Regular check-ups recommended.",
    files: [
      {
        id: "1",
        name: "Dental X-Ray - Feb 2024.pdf",
        uploadDate: "2024-02-20",
        size: "2.4 MB",
      },
      {
        id: "2",
        name: "Treatment Plan.pdf",
        uploadDate: "2024-02-15",
        size: "1.8 MB",
      },
      {
        id: "3",
        name: "Insurance Form.pdf",
        uploadDate: "2024-02-10",
        size: "890 KB",
      },
    ],
    payments: [
      {
        id: "INV-001",
        invoiceId: "INV-001",
        date: "2024-02-20",
        service: "Dental Check-up",
        amount: 150.0,
        status: "Paid",
      },
      {
        id: "INV-002",
        invoiceId: "INV-002",
        date: "2024-01-15",
        service: "X-Ray Examination",
        amount: 300.0,
        status: "Paid",
      },
      {
        id: "INV-003",
        invoiceId: "INV-003",
        date: "2023-12-10",
        service: "Cavity Filling",
        amount: 250.0,
        status: "Pending",
      },
    ],
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    phone: "+1 234-567-8902",
    email: "michael.r@email.com",
    lastVisit: "2024-02-18",
    nextAppointment: "2024-03-01",
    status: "active",
    avatar: "",
    initials: "MR",
    dateOfBirth: "1978-11-30",
    emergencyContact: {
      name: "Lisa Rodriguez",
      relationship: "Spouse",
      phone: "+1 234-567-8905",
    },
    treatmentHistory: [],
    medicalNotes: "",
    files: [],
    payments: [],
  },
  {
    id: "3",
    name: "Emma Davis",
    phone: "+1 234-567-8903",
    email: "emma.d@email.com",
    lastVisit: "2024-02-15",
    nextAppointment: "2024-02-28",
    status: "active",
    avatar: "",
    initials: "ED",
    dateOfBirth: "1992-03-25",
    emergencyContact: {
      name: "Robert Davis",
      relationship: "Father",
      phone: "+1 234-567-8906",
    },
    treatmentHistory: [],
    medicalNotes: "",
    files: [],
    payments: [],
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [patients, setPatients] = useState<Patient[]>(patientsData);

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedPatient(JSON.parse(JSON.stringify(patient)));
    setMedicalNotes(patient.medicalNotes || "");
    setProfileOpen(true);
    setEditMode(false);
    setEditingNotes(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // When entering edit mode, create a copy of the patient data
      setEditedPatient(JSON.parse(JSON.stringify(selectedPatient)));
    } else {
      // When canceling edit mode, revert to original data
      setEditedPatient(JSON.parse(JSON.stringify(selectedPatient)));
    }
  };

  const handleSaveChanges = () => {
    // Only update if editedPatient is not null
    if (editedPatient) {
      setPatients(
        patients.map((p) => (p.id === editedPatient.id ? editedPatient : p))
      );

      // Update the selected patient as well
      setSelectedPatient(editedPatient);
      setEditMode(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section = "basic"
  ) => {
    const { name, value } = e.target;

    if (section === "basic" && editedPatient) {
      setEditedPatient({
        ...editedPatient,
        [name]: value,
      });
    } else if (section === "emergency" && editedPatient) {
      setEditedPatient({
        ...editedPatient,
        emergencyContact: {
          ...editedPatient.emergencyContact,
          [name]: value,
        },
      });
    }
  };

  const handleEditNotes = () => {
    setEditingNotes(true);
  };

  const handleSaveNotes = () => {
    // In a real app, you would save to the backend
    if (selectedPatient) {
      selectedPatient.medicalNotes = medicalNotes;
      setEditingNotes(false);
    }
  };

  const handleCancelNotes = () => {
    if (selectedPatient) {
      setMedicalNotes(selectedPatient.medicalNotes || "");
      setEditingNotes(false);
    }
  };

  const handleStatusChange = (treatmentId: string, newStatus: string) => {
    if (selectedPatient) {
      // Create a copy of the patient's treatment history
      const updatedTreatments = selectedPatient.treatmentHistory.map(
        (treatment) =>
          treatment.id === treatmentId
            ? { ...treatment, status: newStatus }
            : treatment
      );

      // Update the selected patient with the new treatment history
      setSelectedPatient({
        ...selectedPatient,
        treatmentHistory: updatedTreatments,
      });

      // In a real app, you would save this change to the backend
    }
  };

  const handlePaymentStatusChange = (paymentId: string, newStatus: string) => {
    if (selectedPatient) {
      // Create a copy of the patient's payment history
      const updatedPayments = selectedPatient.payments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      );

      // Update the selected patient with the new payment history
      setSelectedPatient({
        ...selectedPatient,
        payments: updatedPayments,
      });

      // In a real app, you would save this change to the backend
    }
  };

  // Get the appropriate badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-900 text-green-100 border-green-700 hover:bg-green-900";
      case "In Progress":
        return "bg-yellow-900 text-yellow-100 border-yellow-700 hover:bg-yellow-900";
      default:
        return "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-900";
    }
  };

  // Get the appropriate icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <Check className="h-4 w-4 mr-2" />;
      case "In Progress":
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  // Get the appropriate badge color based on payment status
  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-900 text-green-100 border-green-700 hover:bg-green-900";
      case "Pending":
        return "bg-yellow-900 text-yellow-100 border-yellow-700 hover:bg-yellow-900";
      default:
        return "bg-gray-900 text-gray-100 border-gray-700 hover:bg-gray-900";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFiles = (files: FileList) => {
    // In a real app, you would upload these files to your server
    // For this demo, we'll just add them to the patient's files array
    if (selectedPatient) {
      const newFiles = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        size: formatFileSize(file.size),
      }));

      setSelectedPatient({
        ...selectedPatient,
        files: [...selectedPatient.files, ...newFiles],
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleDownload = (fileId: string) => {
    // In a real app, this would trigger a file download
    console.log(`Downloading file with ID: ${fileId}`);
    // You would typically make an API call to get the file and trigger a download
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patients</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Total Patients</span>
              <span className="text-2xl font-bold mt-1">256</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Active Patients</span>
              <span className="text-2xl font-bold mt-1">218</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black text-white">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                New Patients (This Month)
              </span>
              <span className="text-2xl font-bold mt-1">24</span>
            </div>
            <div className="bg-gray-800 p-3 rounded-full">
              <UserPlus className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients
                .filter(
                  (patient) =>
                    patient.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    patient.phone.includes(searchQuery) ||
                    patient.email
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={patient.avatar}
                            alt={patient.name}
                          />
                          <AvatarFallback>{patient.initials}</AvatarFallback>
                        </Avatar>
                        {patient.name}
                      </div>
                    </TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.nextAppointment).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
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

      {/* Patient Profile Modal */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-4xl bg-black text-white">
          <DialogHeader className="flex flex-row items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-white"
              onClick={() => setProfileOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl">Patient Profile</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Patient Details
                </TabsTrigger>
                <TabsTrigger
                  value="medical"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Medical History
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Files & Documents
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Payment History
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

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="name"
                          value={editedPatient.name}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="dateOfBirth"
                          type="date"
                          value={editedPatient.dateOfBirth}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {format(
                            new Date(selectedPatient.dateOfBirth),
                            "MM/dd/yyyy"
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="phone"
                          value={editedPatient.phone}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.phone}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Email
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="email"
                          type="email"
                          value={editedPatient.email}
                          onChange={(e) => handleInputChange(e)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Contact Name
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="name"
                          value={editedPatient.emergencyContact.name}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.emergencyContact.name}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="relationship"
                          value={editedPatient.emergencyContact.relationship}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.emergencyContact.relationship}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </Label>
                      {editMode && editedPatient ? (
                        <Input
                          name="phone"
                          value={editedPatient.emergencyContact.phone}
                          onChange={(e) => handleInputChange(e, "emergency")}
                          className="mt-1"
                        />
                      ) : (
                        <div className="border rounded-md p-2">
                          {selectedPatient.emergencyContact.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical">
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-6">
                      Treatment History
                    </h3>
                    <div className="space-y-4">
                      {selectedPatient.treatmentHistory &&
                      selectedPatient.treatmentHistory.length > 0 ? (
                        selectedPatient.treatmentHistory.map((treatment) => (
                          <div
                            key={treatment.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold">
                                {treatment.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${getStatusBadgeClass(treatment.status)} flex items-center`}
                                >
                                  {getStatusIcon(treatment.status)}
                                  {treatment.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-gray-900 text-white border-gray-800"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          treatment.id,
                                          "Completed"
                                        )
                                      }
                                      className="flex items-center cursor-pointer hover:bg-gray-800"
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      <span>Mark as Completed</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusChange(
                                          treatment.id,
                                          "In Progress"
                                        )
                                      }
                                      className="flex items-center cursor-pointer hover:bg-gray-800"
                                    >
                                      <Clock className="mr-2 h-4 w-4" />
                                      <span>Mark as In Progress</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mb-3">
                              {new Date(treatment.date).toLocaleDateString()}
                            </p>
                            <p className="mb-3">{treatment.notes}</p>
                            <p className="text-sm text-gray-300">
                              Doctor: {treatment.doctor}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">
                          No treatment history found.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Medical Notes</h3>
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
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        className="min-h-[100px] bg-gray-800 text-white"
                      />
                    ) : (
                      <p className="p-3 border rounded-md bg-gray-800">
                        {selectedPatient.medicalNotes ||
                          "No medical notes available."}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Documents & Files</h3>

                  {/* Drag & Drop Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-10 mb-6 text-center ${
                      isDragging
                        ? "border-blue-500 bg-blue-50 bg-opacity-10"
                        : "border-gray-600"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                    <p className="mb-2 text-lg">Drag & drop files here</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Or click to browse
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleBrowseClick}
                      className="mx-auto"
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="hidden"
                      multiple
                    />
                  </div>

                  {/* File List */}
                  <div className="space-y-4">
                    {selectedPatient.files.length > 0 ? (
                      selectedPatient.files.map((file) => (
                        <div key={file.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{file.name}</h4>
                              <p className="text-sm text-gray-400">
                                Uploaded on{" "}
                                {new Date(file.uploadDate).toLocaleDateString()}{" "}
                                • {file.size}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(file.id)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        No files or documents found.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-6">Payment History</h3>

                  {selectedPatient.payments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-700">
                          <TableHead className="text-white">
                            Invoice ID
                          </TableHead>
                          <TableHead className="text-white">Date</TableHead>
                          <TableHead className="text-white">Service</TableHead>
                          <TableHead className="text-white">Amount</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient.payments.map((payment) => (
                          <TableRow
                            key={payment.id}
                            className="border-b border-gray-700"
                          >
                            <TableCell className="font-medium">
                              {payment.id}
                            </TableCell>
                            <TableCell>
                              {new Date(payment.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{payment.service}</TableCell>
                            <TableCell>${payment.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getPaymentStatusBadgeClass(
                                    payment.status
                                  )}
                                >
                                  {payment.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-gray-900 text-white border-gray-800"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handlePaymentStatusChange(
                                          payment.id,
                                          "Paid"
                                        )
                                      }
                                      className="flex items-center cursor-pointer hover:bg-gray-800"
                                    >
                                      <Check className="mr-2 h-4 w-4" />
                                      <span>Mark as Paid</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handlePaymentStatusChange(
                                          payment.id,
                                          "Pending"
                                        )
                                      }
                                      className="flex items-center cursor-pointer hover:bg-gray-800"
                                    >
                                      <Clock className="mr-2 h-4 w-4" />
                                      <span>Mark as Pending</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No payment history found.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
