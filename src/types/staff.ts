export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  specialty?: string;
  phone?: string;
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
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