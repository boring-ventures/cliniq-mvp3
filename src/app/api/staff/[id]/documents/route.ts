import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/staff/[id]/documents - Get staff documents
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

    // Fetch documents
    const documents = await prisma.staffDocument.findMany({
      where: { profileId: staffId },
      orderBy: { uploadDate: 'desc' },
    });

    // Format the response
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      uploadDate: doc.uploadDate.toISOString().split('T')[0],
      size: doc.fileSize || '',
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
    }));

    return NextResponse.json(formattedDocuments);
  } catch (error) {
    console.error('Error fetching staff documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/staff/[id]/documents - Upload a document
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

    // In a real app, you would handle file upload to a storage service here
    // For this example, we'll assume the file URL is provided in the request
    const { name, fileUrl, fileType, fileSize } = await request.json();

    // Create the document
    const document = await prisma.staffDocument.create({
      data: {
        profileId: staffId,
        name,
        fileUrl,
        fileType,
        fileSize,
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: userProfile.id,
        action: 'UPLOAD_STAFF_DOCUMENT',
        description: `Uploaded document "${name}" for staff member: ${staffId}`,
      },
    });

    return NextResponse.json({
      id: document.id,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
} 