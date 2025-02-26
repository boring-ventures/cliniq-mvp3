import { useAuth } from './use-auth';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export enum StaffPermission {
  VIEW_STAFF = 'VIEW_STAFF',
  CREATE_STAFF = 'CREATE_STAFF',
  EDIT_STAFF = 'EDIT_STAFF',
  DELETE_STAFF = 'DELETE_STAFF',
  MANAGE_QUALIFICATIONS = 'MANAGE_QUALIFICATIONS',
  MANAGE_DOCUMENTS = 'MANAGE_DOCUMENTS',
  VIEW_PAYROLL = 'VIEW_PAYROLL',
  MANAGE_PAYROLL = 'MANAGE_PAYROLL',
}

export function useStaffPermissions() {
  const { user, session } = useAuth();
  
  // Fetch the user's profile to get their role
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await axios.get(`/api/profile`);
      return response.data;
    },
    enabled: !!user?.id,
  });
  
  // Function to check if the user has a specific permission
  const hasPermission = (permission: StaffPermission): boolean => {
    // If no user is logged in, they have no permissions
    if (!user || !userProfile) return false;
    
    // Get the user's role from the profile
    const userRole = userProfile.role || 'USER';
    
    // Define permissions for each role
    const rolePermissions: Record<string, StaffPermission[]> = {
      SUPER_ADMIN: Object.values(StaffPermission), // Super admins have all permissions
      ADMIN: [
        StaffPermission.VIEW_STAFF,
        StaffPermission.CREATE_STAFF,
        StaffPermission.EDIT_STAFF,
        StaffPermission.MANAGE_QUALIFICATIONS,
        StaffPermission.MANAGE_DOCUMENTS,
        StaffPermission.VIEW_PAYROLL,
      ],
      DOCTOR: [
        StaffPermission.VIEW_STAFF,
      ],
      RECEPTIONIST: [
        StaffPermission.VIEW_STAFF,
      ],
      USER: [],
    };
    
    // Check if the user's role has the requested permission
    return rolePermissions[userRole]?.includes(permission) || false;
  };
  
  // Function to check if the user can manage a specific staff member
  const canManageStaff = (staffId: string): boolean => {
    // If no user is logged in, they can't manage any staff
    if (!user || !userProfile) return false;
    
    // Super admins and admins can manage any staff
    if (hasPermission(StaffPermission.EDIT_STAFF)) return true;
    
    // Users can manage their own profile
    return userProfile.id === staffId;
  };
  
  // For development/testing - grant all permissions if no profile is loaded yet
  const isLoading = !!user && !userProfile;
  const devPermissions = process.env.NODE_ENV === 'development';
  
  return {
    hasPermission,
    canManageStaff,
    isLoading,
    // During development or when loading, grant permissions to make testing easier
    canViewStaff: devPermissions || hasPermission(StaffPermission.VIEW_STAFF),
    canCreateStaff: devPermissions || hasPermission(StaffPermission.CREATE_STAFF),
    canEditStaff: devPermissions || hasPermission(StaffPermission.EDIT_STAFF),
    canDeleteStaff: devPermissions || hasPermission(StaffPermission.DELETE_STAFF),
    canManageQualifications: devPermissions || hasPermission(StaffPermission.MANAGE_QUALIFICATIONS),
    canManageDocuments: devPermissions || hasPermission(StaffPermission.MANAGE_DOCUMENTS),
    canViewPayroll: devPermissions || hasPermission(StaffPermission.VIEW_PAYROLL),
    canManagePayroll: devPermissions || hasPermission(StaffPermission.MANAGE_PAYROLL),
  };
} 