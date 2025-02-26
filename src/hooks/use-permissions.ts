import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

// Create our own Permission enum
export enum Permission {
  CREATE_USER = "CREATE_USER",
  READ_USER = "READ_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
  CREATE_ROLE = "CREATE_ROLE",
  READ_ROLE = "READ_ROLE",
  UPDATE_ROLE = "UPDATE_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  // Add other permissions as needed
}

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
    description: string;
  };
  permissions: Permission[];
  isActive: boolean;
}

export function usePermissions() {
  const { status } = useSession();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<UserData>({
    queryKey: ["user-permissions"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");
      return response.data;
    },
    enabled: status === "authenticated",
  });

  const permissions = userData?.permissions || [];

  /**
   * Check if the user has a specific permission
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!userData) return false;

    // Super Admin has all permissions
    if (userData.role.name === "Super Admin") {
      return true;
    }

    return permissions.includes(permission);
  };

  /**
   * Check if the user has any of the specified permissions
   */
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    if (!userData) return false;

    // Super Admin has all permissions
    if (userData.role.name === "Super Admin") {
      return true;
    }

    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  /**
   * Check if the user has all of the specified permissions
   */
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    if (!userData) return false;

    // Super Admin has all permissions
    if (userData.role.name === "Super Admin") {
      return true;
    }

    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    userData,
    permissions,
    isLoading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
