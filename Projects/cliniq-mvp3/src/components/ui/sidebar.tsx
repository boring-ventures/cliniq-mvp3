"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

// Define the components that are being exported
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>((props, ref) => {
  // Minimal implementation to avoid errors
  return <div ref={ref} {...props} />;
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => {
  return <button ref={ref} {...props} />;
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => {
  return <input ref={ref} {...props} />;
});
SidebarInput.displayName = "SidebarInput";

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarInset.displayName = "SidebarInset";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>((props, ref) => {
  return <ul ref={ref} {...props} />;
});
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => {
  return <button ref={ref} {...props} />;
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>((props, ref) => {
  return <a ref={ref} {...props} />;
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>((props, ref) => {
  return <li ref={ref} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>((props, ref) => {
  return <ul ref={ref} {...props} />;
});
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>((props, ref) => {
  return <a ref={ref} {...props} />;
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>((props, ref) => {
  return <li ref={ref} {...props} />;
});
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarRail.displayName = "SidebarRail";

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>((props, ref) => {
  return <div ref={ref} {...props} />;
});
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>((props, ref) => {
  return <button ref={ref} {...props} />;
});
SidebarTrigger.displayName = "SidebarTrigger";

// Export the components and hooks
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
