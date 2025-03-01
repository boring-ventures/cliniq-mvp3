import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  type: string;
  message: string;
  scheduledFor: Date;
  sentAt?: Date;
  status: string;
  method: string;
  appointment: {
    patient: {
      firstName: string;
      lastName: string;
      phone?: string;
    };
    scheduledAt: Date;
  };
}

export interface NewReminder {
  appointmentId: string;
  type: string;
  message: string;
  scheduledFor: Date;
  method?: string;
}

export function useAppointmentReminders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch reminders
  const useReminders = (filters?: { status?: string; type?: string }) => {
    return useQuery({
      queryKey: ['appointmentReminders', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.type) params.append('type', filters.type);

        const response = await axios.get(`/api/appointments/reminders?${params.toString()}`);
        return response.data;
      },
    });
  };

  // Create reminder
  const createReminder = useMutation({
    mutationFn: async (reminder: NewReminder) => {
      const response = await axios.post('/api/appointments/reminders', reminder);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentReminders'] });
      toast({
        title: "Success",
        description: "Reminder created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to create reminder',
      });
    },
  });

  return {
    useReminders,
    createReminder: createReminder.mutate,
    isCreating: createReminder.isPending,
  };
} 