"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useStaff } from "@/hooks/use-staff";
import { usePatients } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppointments } from "@/hooks/use-appointments";

// Validation schema
const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  scheduledAt: z.string().min(1, "Date and time are required"),
  duration: z.number().min(15, "Minimum duration is 15 minutes"),
  type: z.string().min(1, "Appointment type is required"),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function NewAppointmentPage() {
  const router = useRouter();
  const { staffMembers } = useStaff();
  const { patients } = usePatients();
  const { createAppointment, isCreating } = useAppointments();
  const [date, setDate] = useState<Date>();
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [_selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const [contactPhone, setContactPhone] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");

  // Get only active doctors
  const doctors = staffMembers?.filter(
    staff => staff.role === "DOCTOR" && staff.isActive
  ) || [];

  // Get only active patients
  const activePatients = patients?.filter(
    patient => patient.isActive
  ) || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      duration: 30,
      status: "SCHEDULED",
    },
  });

  const handlePatientSelect = (patient: {
    id: string;
    name: string;
    phone: string;
  }) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setContactPhone(patient.phone);
    setShowPatientResults(false);
  };

  const filteredPatients = activePatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch)
  );

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("#patient-search") &&
        !target.closest(".patient-results")
      ) {
        setShowPatientResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          scheduledAt: new Date(data.scheduledAt).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      router.push("/appointments");
      router.refresh();
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Link href="/appointments">
            <Button variant="ghost" className="mr-2 text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">New Appointment</h1>
        </div>

        <Card className="bg-black text-white border border-gray-800">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-6">Appointment Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient</Label>
                <Select {...register("patientId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {activePatients.map((patient) => (
                      <SelectItem 
                        key={patient.id} 
                        value={patient.id}
                      >
                        {`${patient.firstName} ${patient.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientId && (
                  <p className="text-sm text-red-500">{errors.patientId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctorId">Doctor</Label>
                <Select {...register("doctorId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem 
                        key={doctor.id} 
                        value={doctor.id}
                      >
                        {`${doctor.firstName} ${doctor.lastName} - ${doctor.specialty || 'General'}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.doctorId && (
                  <p className="text-sm text-red-500">{errors.doctorId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Date and Time</Label>
                  <Input
                    type="datetime-local"
                    {...register("scheduledAt")}
                  />
                  {errors.scheduledAt && (
                    <p className="text-sm text-red-500">{errors.scheduledAt.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    type="number"
                    {...register("duration", { valueAsNumber: true })}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">{errors.duration.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select {...register("type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHECKUP">Regular Checkup</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                    <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
                    <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea {...register("reason")} />
                {errors.reason && (
                  <p className="text-sm text-red-500">{errors.reason.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea {...register("notes")} />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Appointment"}
                </Button>
              </div>
            </form>

            {_selectedPatient && (
              <div className="mt-2 text-sm text-gray-400">
                Selected patient: {_selectedPatient.name} (ID:{" "}
                {_selectedPatient.id})
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
