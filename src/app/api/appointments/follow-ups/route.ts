import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const status = searchParams.get("status");

    const followUps = await prisma.followUpSchedule.findMany({
      where: {
        ...(appointmentId && { appointmentId }),
        ...(status && { status }),
      },
      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
      orderBy: {
        scheduledFor: "asc",
      },
    });

    return NextResponse.json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { appointmentId, scheduledFor, message } = body;

    const followUp = await prisma.followUpSchedule.create({
      data: {
        appointmentId,
        scheduledFor: new Date(scheduledFor),
        message,
      },
      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
    });

    return NextResponse.json(followUp);
  } catch (error) {
    console.error("Error creating follow-up:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
