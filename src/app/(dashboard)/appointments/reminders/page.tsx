"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, Calendar, Plus, Search, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RemindersPage() {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [reminderType, setReminderType] = useState("appointment");
  const [followupSchedule, setFollowupSchedule] = useState<
    Array<{ id: number; date: Date | undefined; time: string; message: string }>
  >([{ id: 1, date: undefined, time: "", message: "" }]);
  const [followupModalOpen, setFollowupModalOpen] = useState(false);
  const [tempFollowupSchedule, setTempFollowupSchedule] = useState<
    Array<{ id: number; date: Date | undefined; time: string; message: string }>
  >([{ id: 1, date: undefined, time: "", message: "" }]);
  const [patientSearch, setPatientSearch] = useState("");
  const [showPatientResults, setShowPatientResults] = useState(false);
  const [_selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sentReminderInfo, setSentReminderInfo] = useState<{
    patient: string;
    phone: string;
  } | null>(null);

  // Mock reminder data
  const pendingReminders = [
    {
      id: "1",
      patient: "John Smith",
      phone: "+1 (555) 123-4567",
      appointmentDate: "Feb 26, 2023",
      appointmentTime: "10:00 AM",
      reminderType: "24h Before",
      status: "pending",
      scheduledFor: "Feb 25, 2023 10:00 AM",
    },
    {
      id: "2",
      patient: "Emma Davis",
      phone: "+1 (555) 987-6543",
      appointmentDate: "Feb 27, 2023",
      appointmentTime: "11:45 AM",
      reminderType: "Follow-up",
      status: "pending",
      scheduledFor: "Feb 26, 2023 11:45 AM",
    },
    {
      id: "3",
      patient: "Michael Rodriguez",
      phone: "+1 (555) 456-7890",
      appointmentDate: "Feb 27, 2023",
      appointmentTime: "2:30 PM",
      reminderType: "24h Before",
      status: "pending",
      scheduledFor: "Feb 26, 2023 2:30 PM",
    },
  ];

  const sentReminders = [
    {
      id: "4",
      patient: "Sarah Thompson",
      phone: "+1 (555) 234-5678",
      appointmentDate: "Feb 25, 2023",
      appointmentTime: "9:00 AM",
      reminderType: "24h Before",
      status: "sent",
      sentAt: "Feb 24, 2023 9:00 AM",
    },
    {
      id: "5",
      patient: "Lisa Anderson",
      phone: "+1 (555) 876-5432",
      appointmentDate: "Feb 25, 2023",
      appointmentTime: "2:30 PM",
      reminderType: "24h Before",
      status: "sent",
      sentAt: "Feb 24, 2023 2:30 PM",
    },
  ];

  // Mock patient data for the dropdown
  const patients = [
    { id: "1", name: "John Smith", phone: "+1 (555) 123-4567" },
    { id: "2", name: "Sarah Thompson", phone: "+1 (555) 234-5678" },
    { id: "3", name: "Michael Rodriguez", phone: "+1 (555) 456-7890" },
    { id: "4", name: "Emma Davis", phone: "+1 (555) 987-6543" },
    { id: "5", name: "Lisa Anderson", phone: "+1 (555) 876-5432" },
  ];

  const handleReminderTypeChange = (value: string) => {
    setReminderType(value);
    if (value === "followup") {
      setFollowupModalOpen(true);
    }
  };

  const saveFollowupSchedule = () => {
    setFollowupSchedule([...tempFollowupSchedule]);
    setFollowupModalOpen(false);
  };

  const openFollowupModal = () => {
    setTempFollowupSchedule([...followupSchedule]);
    setFollowupModalOpen(true);
  };

  const addTempScheduleItem = () => {
    const newId =
      tempFollowupSchedule.length > 0
        ? Math.max(...tempFollowupSchedule.map((item) => item.id)) + 1
        : 1;

    setTempFollowupSchedule([
      ...tempFollowupSchedule,
      { id: newId, date: undefined, time: "", message: "" },
    ]);
  };

  const removeTempScheduleItem = (id: number) => {
    if (tempFollowupSchedule.length > 1) {
      setTempFollowupSchedule(
        tempFollowupSchedule.filter((item) => item.id !== id)
      );
    }
  };

  const updateTempScheduleItem = (
    id: number,
    field: string,
    value: string | Date | undefined
  ) => {
    setTempFollowupSchedule(
      tempFollowupSchedule.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handlePatientSelect = (patient: {
    id: string;
    name: string;
    phone: string;
  }) => {
    setSelectedPatient(patient);
    setPatientSearch(`${patient.name} (${patient.phone})`);
    setShowPatientResults(false);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch)
  );

  // Add this useEffect to handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#patient") && !target.closest(".patient-results")) {
        setShowPatientResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSendNow = (reminder: {
    id: string;
    patient: string;
    phone: string;
    appointmentDate: string;
    appointmentTime: string;
  }) => {
    setSentReminderInfo({
      patient: reminder.patient,
      phone: reminder.phone,
    });
    setShowSuccessModal(true);

    // In a real application, you would also make an API call here
    // to actually send the message
  };

  // Add a function to handle editing follow-up reminders
  const handleEditFollowUp = (reminder: { scheduledFor: string }) => {
    // Set up the temporary follow-up schedule based on the reminder's data
    // This is a simplified example - in a real app, you'd fetch the actual follow-up schedule
    setTempFollowupSchedule([
      {
        id: 1,
        date: new Date(reminder.scheduledFor.split(" ")[0]),
        time: reminder.scheduledFor.split(" ")[1],
        message: "Follow-up reminder",
      },
    ]);

    // Open the follow-up modal
    setFollowupModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Appointment Reminders
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
              <DialogDescription>
                Set up a reminder for a patient&apos;s appointment or follow-up.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="patient" className="text-right">
                  Patient
                </Label>
                <div className="col-span-3">
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
                                  if (e.key === "Enter")
                                    handlePatientSelect(patient);
                                }}
                                tabIndex={0}
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    {patient.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {patient.phone}
                                  </span>
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
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reminder Type</Label>
                <RadioGroup
                  defaultValue="appointment"
                  value={reminderType}
                  onValueChange={handleReminderTypeChange}
                  className="col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="appointment" id="appointment" />
                    <Label htmlFor="appointment">Appointment Reminder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followup" id="followup" />
                    <Label htmlFor="followup">Follow-up Reminder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom Message</Label>
                  </div>
                </RadioGroup>
              </div>

              {reminderType === "followup" && (
                <div className="col-span-4 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Follow-up Schedule</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openFollowupModal}
                    >
                      Edit Schedule
                    </Button>
                  </div>

                  <div className="border rounded-md p-4 bg-muted/20">
                    {followupSchedule.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No follow-up messages scheduled
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {followupSchedule.map((item, index) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>Message {index + 1}:</span>
                            <span>
                              {item.date
                                ? format(item.date, "MMM d, yyyy")
                                : "Date not set"}
                              {item.time ? ` at ${item.time}` : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {reminderType !== "followup" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Send Date
                    </Label>
                    <div className="col-span-3">
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
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Send Time
                    </Label>
                    <Select>
                      <SelectTrigger id="time" className="col-span-3">
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
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message here"
                  className="col-span-3 min-h-[100px]"
                  defaultValue="Hello [Patient], this is a reminder for your appointment on [Date] at [Time] with [Doctor]. Please reply YES to confirm or call us at (555) 123-4567 to reschedule."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Send via</Label>
                <div className="col-span-3 flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3 w-3 mr-1 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 flex items-center justify-end space-x-2">
                  <Label
                    htmlFor="send-immediately"
                    className="text-muted-foreground"
                  >
                    Send immediately after creation
                  </Label>
                  <Switch id="send-immediately" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reminders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for the next 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentReminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">In the next 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Reminders</TabsTrigger>
          <TabsTrigger value="sent">Sent Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Reminder Type</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">
                        {reminder.patient}
                      </TableCell>
                      <TableCell>{reminder.phone}</TableCell>
                      <TableCell>
                        {reminder.appointmentDate} at {reminder.appointmentTime}
                      </TableCell>
                      <TableCell>{reminder.reminderType}</TableCell>
                      <TableCell>{reminder.scheduledFor}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNow(reminder)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send Now
                          </Button>

                          {reminder.reminderType === "Follow-up" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditFollowUp(reminder)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">
                        {reminder.patient}
                      </TableCell>
                      <TableCell>{reminder.phone}</TableCell>
                      <TableCell>
                        {reminder.appointmentDate} at {reminder.appointmentTime}
                      </TableCell>
                      <TableCell>{reminder.sentAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Sent
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

      <Dialog open={followupModalOpen} onOpenChange={setFollowupModalOpen}>
        <DialogTrigger asChild>
          <Button>Edit Follow-up Schedule</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Follow-up Schedule</DialogTitle>
            <DialogDescription>
              Add or remove follow-up messages for this reminder.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="followupSchedule" className="text-right">
                Follow-up Schedule
              </Label>
              <div className="col-span-3">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Messages</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTempScheduleItem}
                  >
                    Add Message
                  </Button>
                </div>

                <div className="space-y-4 border rounded-md p-4">
                  {tempFollowupSchedule.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-4 items-start pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="col-span-12 flex items-center justify-between">
                        <h5 className="font-medium text-sm">
                          Message {index + 1}
                        </h5>
                        {tempFollowupSchedule.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTempScheduleItem(item.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="col-span-6">
                        <Label
                          htmlFor={`date-${item.id}`}
                          className="mb-2 block"
                        >
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id={`date-${item.id}`}
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !item.date && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {item.date
                                ? format(item.date, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={item.date}
                              onSelect={(date) =>
                                updateTempScheduleItem(item.id, "date", date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="col-span-6">
                        <Label
                          htmlFor={`time-${item.id}`}
                          className="mb-2 block"
                        >
                          Time
                        </Label>
                        <Select
                          value={item.time}
                          onValueChange={(value) =>
                            updateTempScheduleItem(item.id, "time", value)
                          }
                        >
                          <SelectTrigger id={`time-${item.id}`}>
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

                      <div className="col-span-12">
                        <Label
                          htmlFor={`message-${item.id}`}
                          className="mb-2 block"
                        >
                          Message
                        </Label>
                        <Textarea
                          id={`message-${item.id}`}
                          placeholder="Enter message for this follow-up"
                          value={item.message}
                          onChange={(e) =>
                            updateTempScheduleItem(
                              item.id,
                              "message",
                              e.target.value
                            )
                          }
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFollowupModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveFollowupSchedule}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Message Sent Successfully</DialogTitle>
            <DialogDescription>
              The reminder has been sent to the patient.
            </DialogDescription>
          </DialogHeader>

          {sentReminderInfo && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Patient:</Label>
                  <div className="col-span-3">{sentReminderInfo.patient}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Phone:</Label>
                  <div className="col-span-3">{sentReminderInfo.phone}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Status:</Label>
                  <div className="col-span-3">
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Sent
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Sent at:</Label>
                  <div className="col-span-3">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowSuccessModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {_selectedPatient && (
        <div className="text-sm text-gray-500 mt-1">
          Selected: {_selectedPatient.name}
        </div>
      )}
    </div>
  );
}
