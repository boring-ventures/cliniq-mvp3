import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface StaffFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'USER';
  specialty?: string;
  dateOfBirth?: string;
  joinDate?: string;
  phone?: string;
  address?: string;
  notes?: string;
  workingHours?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  emergencyContact?: {
    name: string;
    relationship?: string;
    phone: string;
  };
  qualifications?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  status?: 'active' | 'inactive';
  payroll?: {
    salary: number;
    paymentFrequency: string;
    bankDetails: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
  };
}

export const defaultFormData: StaffFormData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  role: 'DOCTOR',
  specialty: '',
  phone: '',
  address: '',
  notes: '',
  dateOfBirth: '',
  joinDate: new Date().toISOString().split('T')[0],
  workingHours: [
    { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00' },
    { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00' },
  ],
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  qualifications: [],
  status: 'active',
  payroll: {
    salary: 0,
    paymentFrequency: 'Monthly',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
    },
  },
};

export function useStaffForm(initialData?: Partial<StaffFormData>) {
  const router = useRouter();
  const [formData, setFormData] = useState<StaffFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createStaff = useMutation({
    mutationFn: async (data: StaffFormData) => {
      try {
        const response = await axios.post("/api/staff", data);
        if (!response.data) {
          throw new Error("No response from server");
        }
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("Staff creation error:", errorMessage);
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member created successfully",
      });
      setFormData(defaultFormData);
      router.refresh();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create staff member",
      });
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingHoursChange = (
    index: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      workingHours: prev.workingHours?.map((hours, i) =>
        i === index ? { ...hours, [field]: value } : hours
      ),
    }));
  };

  const handleEmergencyContactChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [name]: value,
      },
    }));
  };

  const addQualification = (qualification: {
    degree: string;
    institution: string;
    year: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [...(prev.qualifications || []), qualification],
    }));
  };

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications?.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.email) errors.push("Email is required");
    if (!formData.password) errors.push("Password is required");
    if (!formData.firstName) errors.push("First name is required");
    if (!formData.lastName) errors.push("Last name is required");
    if (!formData.role) errors.push("Role is required");

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const submitForm = async () => {
    const { isValid, errors } = validateForm();
    
    if (!isValid) {
      errors.forEach(error => {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error,
        });
      });
      return;
    }

    await createStaff.mutateAsync(formData);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleWorkingHoursChange,
    handleEmergencyContactChange,
    addQualification,
    removeQualification,
    submitForm,
    isCreating: createStaff.isPending,
    error: createStaff.error,
  };
} 