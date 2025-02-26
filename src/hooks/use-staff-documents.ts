import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  fileUrl: string;
  fileType?: string;
}

interface NewDocument {
  name: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
}

export function useStaffDocuments(staffId: string) {
  const queryClient = useQueryClient();

  // Fetch documents
  const {
    data: documents = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Document[]>({
    queryKey: ['staff', staffId, 'documents'],
    queryFn: async () => {
      const response = await axios.get(`/api/staff/${staffId}/documents`);
      return response.data;
    },
    enabled: !!staffId,
  });

  // Upload a document
  const uploadDocumentMutation = useMutation({
    mutationFn: async (document: NewDocument) => {
      const response = await axios.post(`/api/staff/${staffId}/documents`, document);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'documents'] });
      queryClient.invalidateQueries({ queryKey: ['staff', staffId] });
      toast.success('Document uploaded successfully');
    },
    onError: (error: any) => {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.error || 'Failed to upload document');
    },
  });

  // Helper function to handle file upload to storage (e.g., Supabase Storage)
  const uploadFile = async (file: File): Promise<NewDocument> => {
    // This is a placeholder - you would implement actual file upload to your storage service
    // For example, using Supabase Storage:
    
    // 1. Create a unique file name
    const fileName = `${Date.now()}-${file.name}`;
    
    // 2. Upload to Supabase Storage (you'll need to implement this)
    // const { data, error } = await supabaseStorage.upload(fileName, file);
    
    // 3. Return the document info
    // For now, we'll return a mock response
    return {
      name: file.name,
      fileUrl: URL.createObjectURL(file), // This is temporary and won't work in production
      fileType: file.type,
      fileSize: `${Math.round(file.size / 1024)} KB`,
    };
  };

  return {
    documents,
    isLoading,
    error,
    refetch,
    uploadDocument: uploadDocumentMutation.mutate,
    isUploadingDocument: uploadDocumentMutation.isPending,
    uploadFile,
  };
} 