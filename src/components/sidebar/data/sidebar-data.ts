import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  UserCog,
  DollarSign,
  Building,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  teams: [
    {
      name: "Clinic",
      logo: Building,
      plan: "Healthcare",
    },
  ],
  navGroups: [
    {
      title: "Dashboard & Navigation",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Appointment Management",
      items: [
        {
          title: "Appointments",
          url: "/appointments",
          icon: Calendar,
          items: [
            {
              title: "Calendar View",
              url: "/appointments/calendar",
            },
            {
              title: "New Appointment",
              url: "/appointments/new",
            },
            {
              title: "Reminders",
              url: "/appointments/reminders",
            },
          ],
        },
      ],
    },
    {
      title: "Patient Management & EMR",
      items: [
        {
          title: "Patients",
          url: "/patients",
          icon: Users,
        },
      ],
    },
    {
      title: "Inventory Management",
      items: [
        {
          title: "Inventory",
          url: "/inventory",
          icon: Package,
        },
      ],
    },
    {
      title: "Doctor & Staff Management",
      items: [
        {
          title: "Staff",
          url: "/staff",
          icon: UserCog,
        },
      ],
    },
    {
      title: "Sales & Financial Management",
      items: [
        {
          title: "Finances",
          url: "/finances",
          icon: DollarSign,
        },
      ],
    },
  ],
};
