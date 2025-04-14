import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Verify session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get the student record associated with this user
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const { courseId, semester } = await req.json();
    
    if (!courseId || !semester) {
      return NextResponse.json(
        { error: 'Course ID and semester are required' },
        { status: 400 }
      );
    }

    // Verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
        semester
      }
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course for the selected semester' },
        { status: 400 }
      );
    }

    // Create new enrollment using the student.id (not user.id)
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: student.id, // This is the critical change
        courseId,
        semester,
        status: 'PENDING'
      },
      include: {
        course: true,
        student: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(enrollment);

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to process enrollment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    // Get the student record first
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: true,
        student: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Failed to fetch enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}