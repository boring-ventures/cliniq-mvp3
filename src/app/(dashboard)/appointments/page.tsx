"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Filter, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");

  // Mock appointment data
  const appointments = [
    {
      id: "1",
      patient: {
        name: "Sarah Thompson",
        avatar: "/avatars/01.png",
        initials: "ST",
      },
      doctor: {
        name: "Dr. Wilson",
        specialty: "Dentist",
      },
      date: "Today",
      time: "09:00 AM",
      status: "confirmed",
      reason: "Regular checkup",
    },
    {
      id: "2",
      patient: {
        name: "Michael Rodriguez",
        avatar: "/avatars/02.png",
        initials: "MR",
      },
      doctor: {
        name: "Dr. Chen",
        specialty: "Orthodontist",
      },
      date: "Today",
      time: "10:30 AM",
      status: "pending",
      reason: "Braces adjustment",
    },
    {
      id: "3",
      patient: {
        name: "Emma Davis",
        avatar: "/avatars/03.png",
        initials: "ED",
      },
      doctor: {
        name: "Dr. Brown",
        specialty: "Periodontist",
      },
      date: "Today",
      time: "11:45 AM",
      status: "confirmed",
      reason: "Gum treatment",
    },
    {
      id: "4",
      patient: {
        name: "John Smith",
        avatar: "/avatars/04.png",
        initials: "JS",
      },
      doctor: {
        name: "Dr. Wilson",
        specialty: "Dentist",
      },
      date: "Tomorrow",
      time: "10:00 AM",
      status: "confirmed",
      reason: "Tooth extraction",
    },
    {
      id: "5",
      patient: {
        name: "Lisa Anderson",
        avatar: "/avatars/05.png",
        initials: "LA",
      },
      doctor: {
        name: "Dr. Chen",
        specialty: "Orthodontist",
      },
      date: "Tomorrow",
      time: "02:30 PM",
      status: "cancelled",
      reason: "Consultation",
    },
  ];

  // Filter appointments based on search query and filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      appointment.patient.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.doctor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    // Doctor filter
    const matchesDoctor =
      doctorFilter === "all" ||
      appointment.doctor.name
        .toLowerCase()
        .includes(doctorFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search appointments..."
                className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={doctorFilter} onValueChange={setDoctorFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="dr. wilson">Dr. Wilson</SelectItem>
              <SelectItem value="dr. chen">Dr. Chen</SelectItem>
              <SelectItem value="dr. brown">Dr. Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No appointments found matching your criteria.
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={appointment.patient.avatar}
                            alt={appointment.patient.name}
                          />
                          <AvatarFallback>
                            {appointment.patient.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {appointment.patient.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.reason}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {appointment.doctor.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.doctor.specialty}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>

                        <Badge
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : appointment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </Badge>

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/appointments/${appointment.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendar View</CardTitle>
              <Link href="/appointments/calendar">
                <Button variant="outline" size="sm">
                  Open Full Calendar
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] flex flex-col items-center justify-center border rounded-lg">
                <Calendar
                  mode="single"
                  selected={new Date()}
                  className="rounded-md border"
                />
                <p className="mt-4 text-muted-foreground">
                  For detailed calendar view with filtering options, click "Open
                  Full Calendar"
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
