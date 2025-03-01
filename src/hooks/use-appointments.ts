import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  reason?: string;
  colorCode?: string;
  createdAt: Date;
  updatedAt: Date;
  patient: {
    firstName: string;
    lastName: string;
    phone?: string;
  };
  doctor: {
    firstName?: string;
    lastName?: string;
    specialty?: string;
  };
}

export interface NewAppointment {
  patientId: string;
  doctorId: string;
  scheduledAt: Date;
  duration?: number;
  status?: string;
  reason?: string;
  colorCode?: string;
}

export function useAppointments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch appointments with filters
  const useFilteredAppointments = (filters?: {
    doctorId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    return useQuery({
      queryKey: ['appointments', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters?.doctorId) params.append('doctorId', filters.doctorId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
        if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

        const response = await axios.get(`/api/appointments?${params.toString()}`);
        return response.data;
      },
    });
  };

  // Create appointment
  const createAppointment = useMutation({
    mutationFn: async (newAppointment: NewAppointment) => {
      const response = await axios.post('/api/appointments', newAppointment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to create appointment',
      });
    },
  });

  // Update appointment
  const updateAppointment = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Appointment> }) => {
      const response = await axios.patch(`/api/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to update appointment',
      });
    },
  });

  // Delete appointment
  const deleteAppointment = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/appointments/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to delete appointment',
      });
    },
  });

  return {
    useFilteredAppointments,
    createAppointment: createAppointment.mutate,
    isCreating: createAppointment.isPending,
    updateAppointment: updateAppointment.mutate,
    isUpdating: updateAppointment.isPending,
    deleteAppointment: deleteAppointment.mutate,
    isDeleting: deleteAppointment.isPending,
  };
} 