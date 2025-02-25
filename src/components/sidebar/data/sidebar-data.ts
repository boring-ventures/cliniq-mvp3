import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  UserCog,
  DollarSign,
  Building,
  User,
  Settings,
  Bell,
  FileText,
  Stethoscope,
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
          icon: Stethoscope,
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

export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
    submenu: [
      {
        title: "All Appointments",
        href: "/appointments",
      },
      {
        title: "New Appointment",
        href: "/appointments/new",
      },
      {
        title: "Reminders",
        href: "/appointments/reminders",
      },
    ],
  },
  {
    title: "Patients",
    href: "/patients",
    icon: User,
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Stethoscope,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];
