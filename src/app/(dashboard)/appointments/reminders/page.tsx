"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Send, Clock, Calendar, RefreshCw } from "lucide-react";
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

export default function RemindersPage() {
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
      reminderType: "24h Before",
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Appointment Reminders</h1>

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
            <CardTitle className="text-sm font-medium">
              Sent Today
            </CardTitle>
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
            <p className="text-xs text-muted-foreground">
              In the next 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">24 Hours Before</h4>
                  <p className="text-sm text-muted-foreground">
                    Send reminder 24 hours before appointment
                  </p>
                </div>
                <Switch id="24h" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">1 Hour Before</h4>
                  <p className="text-sm text-muted-foreground">
                    Send reminder 1 hour before appointment
                  </p>
                </div>
                <Switch id="1h" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Confirmation Required</h4>
                  <p className="text-sm text-muted-foreground">
                    Ask patients to confirm their appointment
                  </p>
                </div>
                <Switch id="confirm" defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Message Template</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Reminder</SelectItem>
                    <SelectItem value="detailed">Detailed with Instructions</SelectItem>
                    <SelectItem value="brief">Brief Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Notification Channel</Label>
                <Select defaultValue="whatsapp">
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending Reminders</TabsTrigger>
          <TabsTrigger value="sent">Sent Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Reminder Type</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.patient}</TableCell>
                      <TableCell>{reminder.phone}</TableCell>
                      <TableCell>
                        {reminder.appointmentDate} at {reminder.appointmentTime}
                      </TableCell>
                      <TableCell>{reminder.reminderType}</TableCell>
                      <TableCell>{reminder.scheduledFor}</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Send className="mr-2 h-4 w-4" />
                          Send Now
                        </Button>
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
            <CardHeader>
              <CardTitle>Sent Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Reminder Type</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell className="font-medium">{reminder.patient}</TableCell>
                      <TableCell>{reminder.phone}</TableCell>
                      <TableCell>
                        {reminder.appointmentDate} at {reminder.appointmentTime}
                      </TableCell>
                      <TableCell>{reminder.reminderType}</TableCell>
                      <TableCell>{reminder.sentAt}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
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
    </div>
  );
} 