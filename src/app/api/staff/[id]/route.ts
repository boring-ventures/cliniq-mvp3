import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/staff/[id] - Get a specific staff member
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile to check role and permissions
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffId = params.id;

    // Fetch staff with related data
    const staff = await prisma.profile.findUnique({
      where: { id: staffId },
      include: {
        workingHours: true,
        emergencyContact: true,
        qualifications: true,
        documents: true,
        payroll: true,
      },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check authorization - only allow admins or the staff member themselves
    if (
      !['SUPER_ADMIN', 'ADMIN'].includes(userProfile.role) &&
      userProfile.id !== staff.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Format the response
    const formattedStaff = {
      id: staff.id,
      name: `${staff.firstName || ''} ${staff.lastName || ''}`.trim(),
      role: staff.role,
      specialty: staff.specialty || '',
      phone: staff.phone || '',
      email: staff.email,
      status: staff.isActive ? 'active' : 'inactive',
      avatar: staff.avatarUrl || '',
      initials: `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase(),
      dateOfBirth: staff.dateOfBirth ? staff.dateOfBirth.toISOString().split('T')[0] : '',
      joinDate: staff.joinDate ? staff.joinDate.toISOString().split('T')[0] : '',
      workingHours: staff.workingHours.reduce((acc, hour) => {
        acc[hour.dayOfWeek.toLowerCase()] = { 
          start: hour.startTime || '', 
          end: hour.endTime || '' 
        };
        return acc;
      }, {
        monday: { start: '', end: '' },
        tuesday: { start: '', end: '' },
        wednesday: { start: '', end: '' },
        thursday: { start: '', end: '' },
        friday: { start: '', end: '' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' },
      }),
      address: staff.address || '',
      emergencyContact: staff.emergencyContact ? {
        name: staff.emergencyContact.name,
        relationship: staff.emergencyContact.relationship || '',
        phone: staff.emergencyContact.phone,
      } : {
        name: '',
        relationship: '',
        phone: '',
      },
      qualifications: staff.qualifications.map(q => ({
        id: q.id,
        degree: q.degree,
        institution: q.institution,
        year: q.year,
      })),
      notes: staff.notes || '',
      documents: staff.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        uploadDate: doc.uploadDate.toISOString().split('T')[0],
        size: doc.fileSize || '',
      })),
      payroll: staff.payroll ? {
        salary: Number(staff.payroll.salary),
        paymentFrequency: staff.payroll.paymentFrequency,
        lastPayment: staff.payroll.lastPayment ? staff.payroll.lastPayment.toISOString().split('T')[0] : '',
        bankDetails: {
          accountName: staff.payroll.accountName || '',
          accountNumber: staff.payroll.accountNumber || '',
          bankName: staff.payroll.bankName || '',
        },
      } : {
        salary: 0,
        paymentFrequency: 'Monthly',
        lastPayment: '',
        bankDetails: {
          accountName: '',
          accountNumber: '',
          bankName: '',
        },
      },
    };

    return NextResponse.json(formattedStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// PUT /api/staff/[id] - Update a staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile to check role
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });
    
    if (!userProfile || !['SUPER_ADMIN', 'ADMIN'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffId = params.id;
    const data = await request.json();

    // Update the staff profile with a transaction to ensure all related data is updated
    await prisma.$transaction(async (tx) => {
      // Update the profile
      await tx.profile.update({
        where: { id: staffId },
        data: {
          firstName: data.name ? data.name.split(' ')[0] : undefined,
          lastName: data.name ? data.name.split(' ').slice(1).join(' ') : undefined,
          role: data.role,
          isActive: data.status === 'active',
          avatarUrl: data.avatar,
          specialty: data.specialty,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
          phone: data.phone,
          address: data.address,
          notes: data.notes,
        },
      });

      // Update working hours
      if (data.workingHours) {
        // Delete existing working hours
        await tx.workingHours.deleteMany({
          where: { profileId: staffId },
        });

        // Create new working hours
        const workingHoursData = Object.entries(data.workingHours).map(([day, hours]) => ({
          profileId: staffId,
          dayOfWeek: day,
          startTime: hours.start,
          endTime: hours.end,
        }));

        await tx.workingHours.createMany({
          data: workingHoursData.filter(h => h.startTime && h.endTime),
        });
      }

      // Update emergency contact
      if (data.emergencyContact) {
        const existingContact = await tx.emergencyContact.findUnique({
          where: { profileId: staffId },
        });

        if (existingContact) {
          await tx.emergencyContact.update({
            where: { id: existingContact.id },
            data: {
              name: data.emergencyContact.name,
              relationship: data.emergencyContact.relationship,
              phone: data.emergencyContact.phone,
            },
          });
        } else if (data.emergencyContact.name) {
          await tx.emergencyContact.create({
            data: {
              profileId: staffId,
              name: data.emergencyContact.name,
              relationship: data.emergencyContact.relationship,
              phone: data.emergencyContact.phone,
            },
          });
        }
      }

      // Update payroll
      if (data.payroll) {
        const existingPayroll = await tx.payroll.findUnique({
          where: { profileId: staffId },
        });

        if (existingPayroll) {
          await tx.payroll.update({
            where: { id: existingPayroll.id },
            data: {
              salary: data.payroll.salary,
              paymentFrequency: data.payroll.paymentFrequency,
              lastPayment: data.payroll.lastPayment ? new Date(data.payroll.lastPayment) : undefined,
              accountName: data.payroll.bankDetails?.accountName,
              accountNumber: data.payroll.bankDetails?.accountNumber,
              bankName: data.payroll.bankDetails?.bankName,
            },
          });
        } else {
          await tx.payroll.create({
            data: {
              profileId: staffId,
              salary: data.payroll.salary,
              paymentFrequency: data.payroll.paymentFrequency,
              lastPayment: data.payroll.lastPayment ? new Date(data.payroll.lastPayment) : null,
              accountName: data.payroll.bankDetails?.accountName,
              accountNumber: data.payroll.bankDetails?.accountNumber,
              bankName: data.payroll.bankDetails?.bankName,
            },
          });
        }
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'UPDATE_STAFF',
        description: `Updated staff member: ${data.name || staffId}`,
      },
    });

    return NextResponse.json({ message: 'Staff updated successfully' });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

// DELETE /api/staff/[id] - Delete a staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile to check role
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });
    
    if (!userProfile || !['SUPER_ADMIN'].includes(userProfile.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffId = params.id;

    // Get staff details for audit log
    const staff = await prisma.profile.findUnique({
      where: { id: staffId },
      select: { firstName: true, lastName: true, userId: true },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Delete the staff profile with a transaction to ensure all related data is deleted
    await prisma.$transaction(async (tx) => {
      // Delete related data first
      await tx.workingHours.deleteMany({ where: { profileId: staffId } });
      await tx.emergencyContact.deleteMany({ where: { profileId: staffId } });
      await tx.qualification.deleteMany({ where: { profileId: staffId } });
      
      // For payroll, we need to delete payments first
      const payroll = await tx.payroll.findUnique({ 
        where: { profileId: staffId },
        select: { id: true }
      });
      
      if (payroll) {
        await tx.payrollPayment.deleteMany({ where: { payrollId: payroll.id } });
        await tx.payroll.delete({ where: { id: payroll.id } });
      }
      
      // Delete documents
      await tx.staffDocument.deleteMany({ where: { profileId: staffId } });
      
      // Finally delete the profile
      await tx.profile.delete({ where: { id: staffId } });
    });

    // Optionally, delete the Supabase user if needed
    if (staff.userId) {
      await supabase.auth.admin.deleteUser(staff.userId);
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'DELETE_STAFF',
        description: `Deleted staff member: ${staff.firstName} ${staff.lastName}`,
      },
    });

    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
} 