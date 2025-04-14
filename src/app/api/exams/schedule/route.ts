// src/app/api/exams/schedule/route.ts
import { NextResponse } from 'next/server';
import { allocateRoomsForExam } from '@/lib/scheduling/allocation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // if (!user || user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { courseId, date, duration, invigilatorId } = body;
    
    const exam = await allocateRoomsForExam({
      courseId,
      date: new Date(date),
      duration: parseInt(duration),
      invigilatorId
    });

    return NextResponse.json(exam);
  } catch (error:any) {
    console.error('Exam scheduling error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to schedule exam' },
      { status: 500 }
    );
  }
}

// GET: Fetch all scheduled exams
export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        course: true,
        invigilator: {
          include: {
            user: true // Include user data for faculty name
          }
        },
        room: true,
      },
      orderBy: { date: 'asc' },
    });

    // Transform data to ensure consistent structure
    const formattedExams = exams.map(exam => ({
      id: exam.id,
      courseId: exam.courseId,
      courseName: exam.course.name,
      date: exam.date.toISOString(),
      duration: exam.duration,
      roomName: exam.room.name,
      invigilatorName: exam.invigilator 
        ? `${exam.invigilator.firstName} ${exam.invigilator.lastName}`
        : 'Not assigned',
      invigilatorId: exam.invigilatorId || null
    }));

    return NextResponse.json(formattedExams);
  } catch (error) {
    console.error('Failed to fetch exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}