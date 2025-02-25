"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CalendarIcon, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function NewAppointmentPage() {
  const [date, setDate] = useState<Date>();
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string, phone: string} | null>(null);

  // Mock patient data
  const patients = [
    { id: "1", name: "John Smith", phone: "+1 (555) 123-4567" },
    { id: "2", name: "Sarah Thompson", phone: "+1 (555) 234-5678" },
    { id: "3", name: "Michael Rodriguez", phone: "+1 (555) 456-7890" },
    { id: "4", name: "Emma Davis", phone: "+1 (555) 987-6543" },
    { id: "5", name: "Lisa Anderson", phone: "+1 (555) 876-5432" },
  ];

  // Mock doctor data
  const doctors = [
    { id: "1", name: "Dr. Wilson", specialty: "General Dentist" },
    { id: "2", name: "Dr. Chen", specialty: "Orthodontist" },
    { id: "3", name: "Dr. Patel", specialty: "Periodontist" },
    { id: "4", name: "Dr. Johnson", specialty: "Oral Surgeon" },
  ];

  const handlePatientSelect = (patient: {id: string, name: string, phone: string}) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.name} (${patient.phone})`);
    setShowPatientResults(false);
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
    patient.phone.includes(patientSearch)
  );

  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#patient') && !target.closest('.patient-results')) {
        setShowPatientResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">New Appointment</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient</Label>
                <div className="relative">
                  <Input
                    id="patient"
                    placeholder="Search patient by name or phone"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setShowPatientResults(true);
                      if (e.target.value === "") {
                        setSelectedPatient(null);
                      }
                    }}
                    onFocus={() => setShowPatientResults(true)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  
                  {showPatientResults && patientSearch && (
                    <div className="absolute z-10 mt-1 w-full rounded-md bg-popover shadow-md">
                      <ul className="max-h-60 overflow-auto rounded-md py-1 text-base">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <li
                              key={patient.id}
                              className="relative cursor-pointer select-none py-2 px-3 hover:bg-accent"
                              onClick={() => handlePatientSelect(patient)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handlePatientSelect(patient);
                              }}
                              tabIndex={0}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-muted-foreground">{patient.phone}</span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="relative cursor-default select-none py-2 px-3 text-muted-foreground">
                            No patients found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select>
                  <SelectTrigger id="doctor">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00">09:00 AM</SelectItem>
                    <SelectItem value="9:30">09:30 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="10:30">10:30 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="11:30">11:30 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="12:30">12:30 PM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="13:30">01:30 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="14:30">02:30 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="15:30">03:30 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                    <SelectItem value="16:30">04:30 PM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="confirmed">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for the appointment"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Appointment</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 