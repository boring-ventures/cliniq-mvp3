import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// GET /api/staff - Get all staff members
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue" },
        { status: 401 }
      );
    }

    // Get user profile to check role
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true, id: true },
    });

    // Allow SUPER_ADMIN, ADMIN, and DOCTOR to view staff
    if (
      !userProfile ||
      !["SUPER_ADMIN", "ADMIN", "DOCTOR"].includes(userProfile.role)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to view staff" },
        { status: 403 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");

    // Build filter conditions based on role
    const whereClause: any = {
      // DOCTOR can only see other doctors and receptionists
      role: {
        in:
          userProfile.role === "DOCTOR"
            ? ["DOCTOR", "RECEPTIONIST"]
            : ["DOCTOR", "RECEPTIONIST", "ADMIN", "SUPER_ADMIN"],
      },
      ...(isActive && { isActive: isActive === "true" }),
    };

    // Add role filter if specified
    if (role && role !== "all") {
      whereClause.role = role;
    }

    // Add search filter if specified
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
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
        createdAt: "desc",
      },
    });

    // Format the response
    const formattedStaff = staffMembers.map((staff) => ({
      id: staff.id,
      name: `${staff.firstName || ""} ${staff.lastName || ""}`.trim(),
      role: staff.role,
      specialty: staff.specialty || "",
      phone: staff.phone || "",
      email: staff.email,
      status: staff.isActive ? "active" : "inactive",
      avatar: staff.avatarUrl || "",
      initials:
        `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`.toUpperCase(),
      dateOfBirth: staff.dateOfBirth
        ? staff.dateOfBirth.toISOString().split("T")[0]
        : "",
      joinDate: staff.joinDate
        ? staff.joinDate.toISOString().split("T")[0]
        : "",
      workingHours: staff.workingHours.reduce(
        (acc, hour) => {
          acc[hour.dayOfWeek.toLowerCase() as keyof typeof acc] = {
            start: hour.startTime || "",
            end: hour.endTime || "",
          };
          return acc;
        },
        {
          monday: { start: "", end: "" },
          tuesday: { start: "", end: "" },
          wednesday: { start: "", end: "" },
          thursday: { start: "", end: "" },
          friday: { start: "", end: "" },
          saturday: { start: "", end: "" },
          sunday: { start: "", end: "" },
        }
      ),
      address: staff.address || "",
      emergencyContact: staff.emergencyContact
        ? {
            name: staff.emergencyContact.name,
            relationship: staff.emergencyContact.relationship || "",
            phone: staff.emergencyContact.phone,
          }
        : {
            name: "",
            relationship: "",
            phone: "",
          },
      qualifications: staff.qualifications.map((q) => ({
        id: q.id,
        degree: q.degree,
        institution: q.institution,
        year: q.year,
      })),
      notes: staff.notes || "",
      documents: staff.documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        uploadDate: doc.uploadDate.toISOString().split("T")[0],
        size: doc.fileSize || "",
      })),
      payroll: staff.payroll
        ? {
            salary: Number(staff.payroll.salary),
            paymentFrequency: staff.payroll.paymentFrequency,
            lastPayment: staff.payroll.lastPayment
              ? staff.payroll.lastPayment.toISOString().split("T")[0]
              : "",
            bankDetails: {
              accountName: staff.payroll.accountName || "",
              accountNumber: staff.payroll.accountNumber || "",
              bankName: staff.payroll.bankName || "",
            },
          }
        : {
            salary: 0,
            paymentFrequency: "Monthly",
            lastPayment: "",
            bankDetails: {
              accountName: "",
              accountNumber: "",
              bankName: "",
            },
          },
    }));

    return NextResponse.json(formattedStaff);
  } catch (error) {
    console.error("Error in staff GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/staff - Create a new staff member
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (
      !body.email ||
      !body.password ||
      !body.firstName ||
      !body.lastName ||
      !body.role
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Supabase user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          role: body.role,
        },
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create profile in database
    const staff = await prisma.profile.create({
      data: {
        userId: authData.user.id,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        specialty: body.specialty || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        joinDate: body.joinDate ? new Date(body.joinDate) : new Date(),
        phone: body.phone || null,
        address: body.address || null,
        notes: body.notes || null,
        isActive: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error("Staff creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create staff member" },
      { status: 500 }
    );
  }
}
