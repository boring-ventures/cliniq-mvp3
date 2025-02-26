import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// PUT /api/staff/[id]/notes - Update staff notes
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
    
    // Get user profile to check role and permissions
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });
    
    if (!userProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const staffId = params.id;
    const { notes } = await request.json();

    // Check authorization - only allow admins or the staff member themselves
    const staff = await prisma.profile.findUnique({
      where: { id: staffId },
      select: { id: true },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    if (
      !['SUPER_ADMIN', 'ADMIN'].includes(userProfile.role) &&
      userProfile.id !== staffId
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the notes
    await prisma.profile.update({
      where: { id: staffId },
      data: { notes },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'UPDATE_STAFF_NOTES',
        description: `Updated notes for staff member: ${staffId}`,
      },
    });

    return NextResponse.json({ message: 'Notes updated successfully' });
  } catch (error) {
    console.error('Error updating staff notes:', error);
    return NextResponse.json({ error: 'Failed to update notes' }, { status: 500 });
  }
} 