import { useState } from 'react';
import { StaffMember, NewStaffMember } from './use-staff';

// Default empty staff member for new staff creation
const defaultNewStaff: NewStaffMember = {
  name: '',
  role: 'DOCTOR',
  specialty: '',
  phone: '',
  email: '',
  status: 'active',
  avatar: '',
  dateOfBirth: '',
  joinDate: new Date().toISOString().split('T')[0],
  workingHours: {
    monday: { start: '09:00', end: '17:00' },
    tuesday: { start: '09:00', end: '17:00' },
    wednesday: { start: '09:00', end: '17:00' },
    thursday: { start: '09:00', end: '17:00' },
    friday: { start: '09:00', end: '17:00' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  },
  address: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
  qualifications: [],
  notes: '',
  documents: [],
  payroll: {
    salary: 0,
    paymentFrequency: 'Monthly',
    lastPayment: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
    },
  },
  password: '',
};

export function useStaffForm(initialStaff?: StaffMember) {
  // If initialStaff is provided, we're editing an existing staff member
  // Otherwise, we're creating a new one
  const [staff, setStaff] = useState<NewStaffMember | StaffMember>(
    initialStaff || defaultNewStaff
  );
  
  // For new qualification form
  const [newQualification, setNewQualification] = useState({
    degree: '',
    institution: '',
    year: '',
  });

  // Handle input changes for basic staff info
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested object changes (like emergencyContact)
  const handleNestedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    nestedKey: string
  ) => {
    const { name, value } = e.target;
    setStaff((prev) => ({
      ...prev,
      [nestedKey]: {
        ...prev[nestedKey as keyof typeof prev],
        [name]: value,
      },
    }));
  };

  // Handle deeply nested object changes (like payroll.bankDetails)
  const handleDeepNestedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    parentKey: string,
    childKey: string
  ) => {
    const { name, value } = e.target;
    setStaff((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey as keyof typeof prev],
        [childKey]: {
          ...((prev[parentKey as keyof typeof prev] as any)[childKey]),
          [name]: value,
        },
      },
    }));
  };

  // Handle working hours changes
  const handleWorkingHoursChange = (
    day: string,
    timeType: 'start' | 'end',
    value: string
  ) => {
    setStaff((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day as keyof typeof prev.workingHours],
          [timeType]: value,
        },
      },
    }));
  };

  // Handle qualification input changes
  const handleQualificationInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewQualification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a qualification to the staff member
  const addQualification = () => {
    if (newQualification.degree && newQualification.institution && newQualification.year) {
      setStaff((prev) => ({
        ...prev,
        qualifications: [
          ...prev.qualifications,
          {
            id: `temp-${Date.now()}`, // Temporary ID for UI purposes
            ...newQualification,
          },
        ],
      }));
      setNewQualification({
        degree: '',
        institution: '',
        year: '',
      });
    }
  };

  // Remove a qualification from the staff member
  const removeQualification = (id: string) => {
    setStaff((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((q) => q.id !== id),
    }));
  };

  // Reset the form
  const resetForm = () => {
    setStaff(initialStaff || defaultNewStaff);
    setNewQualification({
      degree: '',
      institution: '',
      year: '',
    });
  };

  return {
    staff,
    setStaff,
    newQualification,
    handleInputChange,
    handleNestedInputChange,
    handleDeepNestedInputChange,
    handleWorkingHoursChange,
    handleQualificationInputChange,
    addQualification,
    removeQualification,
    resetForm,
  };
} 