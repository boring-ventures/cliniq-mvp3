"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

export default function CalendarViewPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");

  // Mock appointment data
  const appointments = [
    {
      id: "1",
      patient: "Sarah Thompson",
      doctor: "Dr. Wilson",
      doctorId: "wilson",
      date: new Date(),
      time: "09:00",
      endTime: "09:30",
      status: "confirmed",
      reason: "Regular checkup",
      color: "green",
    },
    {
      id: "2",
      patient: "Michael Rodriguez",
      doctor: "Dr. Chen",
      doctorId: "chen",
      date: new Date(),
      time: "10:30",
      endTime: "11:00",
      status: "pending",
      reason: "Braces adjustment",
      color: "yellow",
    },
    {
      id: "3",
      patient: "Emma Davis",
      doctor: "Dr. Brown",
      doctorId: "brown",
      date: new Date(),
      time: "11:45",
      endTime: "12:15",
      status: "confirmed",
      reason: "Gum treatment",
      color: "green",
    },
    {
      id: "4",
      patient: "John Smith",
      doctor: "Dr. Wilson",
      doctorId: "wilson",
      date: addDays(new Date(), 1),
      time: "10:00",
      endTime: "10:30",
      status: "confirmed",
      reason: "Tooth extraction",
      color: "green",
    },
    {
      id: "5",
      patient: "Lisa Anderson",
      doctor: "Dr. Chen",
      doctorId: "chen",
      date: addDays(new Date(), 1),
      time: "14:30",
      endTime: "15:00",
      status: "cancelled",
      reason: "Consultation",
      color: "red",
    },
  ];

  // Filter appointments by doctor
  const filteredAppointments = appointments.filter(
    (appointment) => selectedDoctor === "all" || appointment.doctorId === selectedDoctor
  );

  // Get days for week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Time slots for day view
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start at 8 AM
    return `${hour}:00`;
  });

  // Helper to get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter((appointment) => 
      isSameDay(appointment.date, day)
    );
  };

  // Navigate between weeks
  const previousWeek = () => {
    setDate(addDays(date, -7));
  };

  const nextWeek = () => {
    setDate(addDays(date, 7));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar View</h1>
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </div>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="wilson">Dr. Wilson</SelectItem>
              <SelectItem value="chen">Dr. Chen</SelectItem>
              <SelectItem value="brown">Dr. Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {view === "day" 
              ? format(date, "EEEE, MMMM d, yyyy") 
              : view === "week" 
                ? `Week of ${format(weekStart, "MMMM d, yyyy")}`
                : format(date, "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {view === "month" ? (
            <div className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
                components={{
                  DayContent: (props) => {
                    const dayAppointments = getAppointmentsForDay(props.date);
                    return (
                      <div className="relative h-full w-full p-2">
                        <div>{props.date.getDate()}</div>
                        {dayAppointments.length > 0 && (
                          <div className="absolute bottom-1 right-1">
                            <Badge variant="outline" className="text-xs">
                              {dayAppointments.length}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  },
                }}
              />
            </div>
          ) : view === "week" ? (
            <div className="grid grid-cols-7 gap-2 min-h-[600px]">
              {days.map((day, i) => (
                <div key={i} className="border rounded-md">
                  <div className="p-2 text-center font-medium border-b bg-muted/20">
                    {format(day, "EEE")}
                    <div className="text-sm text-muted-foreground">
                      {format(day, "MMM d")}
                    </div>
                  </div>
                  <div className="p-2 space-y-2 h-[600px] overflow-y-auto">
                    {getAppointmentsForDay(day).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`p-2 rounded-md text-sm ${
                          appointment.color === "green"
                            ? "bg-green-100 border-green-200"
                            : appointment.color === "yellow"
                            ? "bg-yellow-100 border-yellow-200"
                            : "bg-red-100 border-red-200"
                        } border`}
                      >
                        <div className="font-medium">{appointment.time} - {appointment.patient}</div>
                        <div className="text-xs text-muted-foreground">{appointment.doctor}</div>
                        <div className="text-xs">{appointment.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 min-h-[600px]">
              {timeSlots.map((time, i) => {
                const hourAppointments = filteredAppointments.filter(
                  (appointment) => 
                    isSameDay(appointment.date, date) && 
                    appointment.time.startsWith(time.split(":")[0])
                );
                
                return (
                  <div key={i} className="grid grid-cols-[100px_1fr] border-b pb-2">
                    <div className="text-muted-foreground">{time}</div>
                    <div className="space-y-1">
                      {hourAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-2 rounded-md text-sm ${
                            appointment.color === "green"
                              ? "bg-green-100 border-green-200"
                              : appointment.color === "yellow"
                              ? "bg-yellow-100 border-yellow-200"
                              : "bg-red-100 border-red-200"
                          } border`}
                        >
                          <div className="font-medium">
                            {appointment.time} - {appointment.patient}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {appointment.doctor}
                          </div>
                          <div className="text-xs">{appointment.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 