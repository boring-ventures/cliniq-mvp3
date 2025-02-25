"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Permission } from "@prisma/client";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserList } from "./components/user-list";

export default function UsersPage() {
  const router = useRouter();

  return (
    <PermissionGuard permission={Permission.READ_USER} redirectTo="/">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <PermissionGuard permission={Permission.CREATE_USER} fallback={null}>
            <Button onClick={() => router.push("/users/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </PermissionGuard>
        </div>

        <div className="mt-6">
          <UserList />
        </div>
      </div>
    </PermissionGuard>
  );
}
