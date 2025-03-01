import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export interface FollowUpSchedule {
  id: string;
  appointmentId: string;
  scheduledFor: Date;
  message: string;
  status: string;
  appointment: {
    patient: {
      firstName: string;
      lastName: string;
    };
    doctor: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export interface NewFollowUp {
  appointmentId: string;
  scheduledFor: Date;
  message: string;
}

export function useAppointmentFollowUps() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch follow-ups
  const useFollowUps = (filters?: { appointmentId?: string; status?: string }) => {
    return useQuery({
      queryKey: ['followUps', filters],
      queryFn: async () => {
        const params = new URLSearchParams();
        if (filters?.appointmentId) params.append('appointmentId', filters.appointmentId);
        if (filters?.status) params.append('status', filters.status);

        const response = await axios.get(`/api/appointments/follow-ups?${params.toString()}`);
        return response.data;
      },
    });
  };

  // Create follow-up
  const createFollowUp = useMutation({
    mutationFn: async (followUp: NewFollowUp) => {
      const response = await axios.post('/api/appointments/follow-ups', followUp);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUps'] });
      toast({
        title: "Success",
        description: "Follow-up scheduled successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Failed to schedule follow-up',
      });
    },
  });

  return {
    useFollowUps,
    createFollowUp: createFollowUp.mutate,
    isCreating: createFollowUp.isPending,
  };
} 