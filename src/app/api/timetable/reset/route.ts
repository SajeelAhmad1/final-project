import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Reset all scheduled classes to unscheduled status
    const resetClasses = await prisma.class.updateMany({
      where: { status: "SCHEDULED" },
      data: {
        status: "UNSCHEDULED",
        roomId: null,
        dayOfWeek: null,
        startTime: null,
        endTime: null
      }
    });

    return NextResponse.json({
      success: true,
      resetCount: resetClasses.count,
      message: `Reset ${resetClasses.count} scheduled classes`
    });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to reset timetable',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}