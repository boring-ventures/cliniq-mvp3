import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Qualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface NewQualification {
  degree: string;
  institution: string;
  year: string;
}

export function useStaffQualifications(staffId: string) {
  const queryClient = useQueryClient();

  // Fetch qualifications
  const {
    data: qualifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Qualification[]>({
    queryKey: ['staff', staffId, 'qualifications'],
    queryFn: async () => {
      const response = await axios.get(`/api/staff/${staffId}/qualifications`);
      return response.data;
    },
    enabled: !!staffId,
  });

  // Add a qualification
  const addQualificationMutation = useMutation({
    mutationFn: async (qualification: NewQualification) => {
      const response = await axios.post(`/api/staff/${staffId}/qualifications`, qualification);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'qualifications'] });
      queryClient.invalidateQueries({ queryKey: ['staff', staffId] });
      toast.success('Qualification added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding qualification:', error);
      toast.error(error.response?.data?.error || 'Failed to add qualification');
    },
  });

  return {
    qualifications,
    isLoading,
    error,
    refetch,
    addQualification: addQualificationMutation.mutate,
    isAddingQualification: addQualificationMutation.isPending,
  };
} 