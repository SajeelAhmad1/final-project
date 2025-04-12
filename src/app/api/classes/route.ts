import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const unscheduledClasses = await prisma.class.findMany({
      where: { status: "UNSCHEDULED" },
      include: { 
        course: true,
        section: {
          include: {
            session: true
          }
        }
      }
    });
    
    const scheduledClasses = await prisma.class.findMany({
      where: { status: "SCHEDULED" },
      include: { 
        course: true, 
        room: true,
        section: {
          include: {
            session: true
          }
        }
      },
      orderBy: { dayOfWeek: 'asc' }
    });
    
    return NextResponse.json({ unscheduledClasses, scheduledClasses });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { courseId, roomId, sessionId, sectionId } = await request.json();
  
  try {
    const newClass = await prisma.class.create({
      data: {
        courseId,
        roomId: roomId || null,
        sectionId: sectionId || null,
        status: "UNSCHEDULED",
        startTime: new Date(), // Temporary, will be set during generation
        endTime: new Date(),  // Temporary, will be set during generation
        dayOfWeek: "Monday"   // Temporary, will be set during generation
      }
    });
    
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}