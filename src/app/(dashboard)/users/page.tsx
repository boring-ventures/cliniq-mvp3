"use client";

import { useRouter } from "next/navigation";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserList } from "./components/user-list";

enum Permission {
  READ_USER = "READ_USER",
  CREATE_USER = "CREATE_USER",
}

export default function UsersPage() {
  const router = useRouter();

  return (
    <PermissionGuard permissions={Permission.READ_USER} redirectTo="/">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Management</h1>
          <PermissionGuard permissions={Permission.CREATE_USER} fallback={null}>
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
