"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Package, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,850</div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850</div>
            <p className="text-xs text-muted-foreground">4 invoices pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Overview and Doctor Availability */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/01.png" alt="Sarah Thompson" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Sarah Thompson
                  </p>
                  <p className="text-sm text-muted-foreground">
                    09:00 AM with Dr. Wilson
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Confirmed
                </Badge>
              </div>

              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/02.png" alt="Michael Rodriguez" />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Michael Rodriguez
                  </p>
                  <p className="text-sm text-muted-foreground">
                    10:30 AM with Dr. Chen
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Pending
                </Badge>
              </div>

              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/03.png" alt="Emma Davis" />
                  <AvatarFallback>ED</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Emma Davis</p>
                  <p className="text-sm text-muted-foreground">
                    11:45 AM with Dr. Brown
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Confirmed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/04.png" alt="Dr. Sarah Wilson" />
                  <AvatarFallback>SW</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dr. Sarah Wilson
                  </p>
                  <p className="text-sm text-muted-foreground">Dentist</p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Available
                </Badge>
              </div>

              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/05.png" alt="Dr. Michael Chen" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dr. Michael Chen
                  </p>
                  <p className="text-sm text-muted-foreground">Orthodontist</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  In Session
                </Badge>
              </div>

              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="/avatars/06.png" alt="Dr. Emily Brown" />
                  <AvatarFallback>EB</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dr. Emily Brown
                  </p>
                  <p className="text-sm text-muted-foreground">Periodontist</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                  Break
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WhatsApp Reminders and Inventory Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium leading-none mr-2">
                      John Smith
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Appointment reminder for Feb 26 at 10:00 AM
                  </p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                  Pending
                </Badge>
              </div>

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium leading-none mr-2">
                      Lisa Anderson
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Appointment reminder for Feb 26 at 2:30 PM
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Sent
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Dental Floss
                  </p>
                  <p className="text-sm text-muted-foreground">
                    15 remaining (Min: 50)
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Disposable Gloves
                  </p>
                  <p className="text-sm text-muted-foreground">
                    100 remaining (Min: 500)
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Fluoride Gel
                  </p>
                  <p className="text-sm text-muted-foreground">
                    5 remaining (Min: 20)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
