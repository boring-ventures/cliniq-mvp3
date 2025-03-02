import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from 'next/navigation';

// Types
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialty?: string;
  phone: string;
  email: string;
  status: string;
  avatar: string;
  initials: string;
  dateOfBirth: string;
  joinDate: string;
  workingHours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  qualifications: {
    id: string;
    degree: string;
    institution: string;
    year: string;
  }[];
  notes: string;
  documents: {
    id: string;
    name: string;
    uploadDate: string;
    size: string;
  }[];
  payroll: {
    salary: number;
    paymentFrequency: string;
    lastPayment: string;
    bankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
  };
}

export interface NewStaffMember extends Omit<StaffMember, 'id' | 'initials'> {
  password?: string;
  userId?: string;
}

export function useStaff() {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: staffMembers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      try {
        // Check auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth/signin');
          throw new Error('Not authenticated');
        }

        const response = await axios.get('/api/staff', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        return response.data || [];
      } catch (error: any) {
        if (error.response?.status === 401) {
          router.push('/auth/signin');
        }
        console.error('Error fetching staff:', error);
        throw new Error(error.response?.data?.error || 'Failed to load staff data');
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch a single staff member
  const useStaffMember = (id: string) => {
    return useQuery<StaffMember>({
      queryKey: ['staff', id],
      queryFn: async () => {
        const response = await axios.get(`/api/staff/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // Create a new staff member
  const createStaffMutation = useMutation({
    mutationFn: async (newStaff: NewStaffMember) => {
      const response = await axios.post('/api/staff', newStaff);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Staff member created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error creating staff:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to create staff member',
      });
    },
  });

  // Update a staff member
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaffMember> }) => {
      const response = await axios.put(`/api/staff/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating staff:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to update staff member',
      });
    },
  });

  // Delete a staff member
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/staff/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting staff:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to delete staff member',
      });
    },
  });

  // Update staff notes
  const updateStaffNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const response = await axios.put(`/api/staff/${id}/notes`, { notes });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
      toast({
        title: "Success",
        description: "Notes updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating notes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to update notes',
      });
    },
  });

  return {
    staffMembers,
    isLoading,
    error,
    refetch,
    filterRole,
    setFilterRole,
    searchQuery,
    setSearchQuery,
    useStaffMember,
    createStaff: createStaffMutation.mutate,
    isCreatingStaff: createStaffMutation.isPending,
    updateStaff: updateStaffMutation.mutate,
    isUpdatingStaff: updateStaffMutation.isPending,
    deleteStaff: deleteStaffMutation.mutate,
    isDeletingStaff: deleteStaffMutation.isPending,
    updateStaffNotes: updateStaffNotesMutation.mutate,
    isUpdatingNotes: updateStaffNotesMutation.isPending,
  };
} 