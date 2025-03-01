import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/staff - Get all staff members
export async function GET(request: NextRequest) {
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    // Build filter conditions
    const whereClause: any = {
      // Only include staff roles (not regular users)
      role: {
        in: ['DOCTOR', 'RECEPTIONIST', 'ADMIN', 'SUPER_ADMIN'],
      },
    };

    // Add role filter if specified
    if (role && role !== 'all') {
      whereClause.role = role;
    }

    // Add search filter if specified
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Fetch staff members with related data
    const staffMembers = await prisma.profile.findMany({
      where: whereClause,
      include: {
        workingHours: true,
        emergencyContact: true,
        qualifications: true,
        documents: true,
        payroll: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response
    const formattedStaff = staffMembers.map(staff => ({
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
        acc[hour.dayOfWeek.toLowerCase() as keyof typeof acc] = { 
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
    }));

    return NextResponse.json(formattedStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST /api/staff - Create a new staff member
export async function POST(request: NextRequest) {
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

    const data = await request.json();
    
    // Create Supabase user first if email and password are provided
    let supabaseUserId = data.userId;
    
    if (data.email && data.password && !supabaseUserId) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
      });
      
      if (authError) {
        console.error('Error creating Supabase user:', authError);
        return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
      }
      
      supabaseUserId = authData.user.id;
    }
    
    // Create the staff profile with a transaction to ensure all related data is created
    const result = await prisma.$transaction(async (tx) => {
      // Create the profile
      const profile = await tx.profile.create({
        data: {
          email: data.email,
          hashedPassword: '', // We're using Supabase auth, so no need to store password
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' '),
          role: data.role,
          isActive: data.status === 'active',
          avatarUrl: data.avatar,
          userId: supabaseUserId || data.email, // Use Supabase user ID or email as fallback
          specialty: data.specialty,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
          phone: data.phone,
          address: data.address,
          notes: data.notes,
        },
      });

      // Create working hours
      if (data.workingHours) {
        const workingHoursData = Object.entries(data.workingHours).map(([day, hours]) => ({
          profileId: profile.id,
          dayOfWeek: day,
          startTime: hours.start,
          endTime: hours.end,
        }));

        await tx.workingHours.createMany({
          data: workingHoursData.filter(h => h.startTime && h.endTime),
        });
      }

      // Create emergency contact
      if (data.emergencyContact && data.emergencyContact.name) {
        await tx.emergencyContact.create({
          data: {
            profileId: profile.id,
            name: data.emergencyContact.name,
            relationship: data.emergencyContact.relationship,
            phone: data.emergencyContact.phone,
          },
        });
      }

      // Create qualifications
      if (data.qualifications && data.qualifications.length > 0) {
        await tx.qualification.createMany({
          data: data.qualifications.map(q => ({
            profileId: profile.id,
            degree: q.degree,
            institution: q.institution,
            year: q.year,
          })),
        });
      }

      // Create payroll
      if (data.payroll) {
        await tx.payroll.create({
          data: {
            profileId: profile.id,
            salary: data.payroll.salary,
            paymentFrequency: data.payroll.paymentFrequency,
            lastPayment: data.payroll.lastPayment ? new Date(data.payroll.lastPayment) : null,
            accountName: data.payroll.bankDetails?.accountName,
            accountNumber: data.payroll.bankDetails?.accountNumber,
            bankName: data.payroll.bankDetails?.bankName,
          },
        });
      }

      return profile;
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'CREATE_STAFF',
        description: `Created staff member: ${data.name}`,
      },
    });

    return NextResponse.json({ id: result.id, message: 'Staff created successfully' });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
} 