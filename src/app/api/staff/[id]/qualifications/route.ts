import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/staff/[id]/qualifications - Get staff qualifications
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

    // Check authorization - only allow admins or the staff member themselves
    if (
      !['SUPER_ADMIN', 'ADMIN'].includes(userProfile.role) &&
      userProfile.id !== staffId
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch qualifications
    const qualifications = await prisma.qualification.findMany({
      where: { profileId: staffId },
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(qualifications);
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    return NextResponse.json({ error: 'Failed to fetch qualifications' }, { status: 500 });
  }
}

// POST /api/staff/[id]/qualifications - Add a qualification
export async function POST(
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
    const { degree, institution, year } = await request.json();

    // Create the qualification
    const qualification = await prisma.qualification.create({
      data: {
        profileId: staffId,
        degree,
        institution,
        year,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'ADD_STAFF_QUALIFICATION',
        description: `Added qualification "${degree}" for staff member: ${staffId}`,
      },
    });

    return NextResponse.json({
      id: qualification.id,
      message: 'Qualification added successfully',
    });
  } catch (error) {
    console.error('Error adding qualification:', error);
    return NextResponse.json({ error: 'Failed to add qualification' }, { status: 500 });
  }
} 