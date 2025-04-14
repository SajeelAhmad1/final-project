import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const { studentId } = params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            email: true,
            verified: true,
            createdAt: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                code: true,
                name: true,
                credits: true,
              },
            },
          },
        },
        seatings: {
          include: {
            exam: {
              include: {
                course: {
                  select: {
                    code: true,
                    name: true,
                  },
                },
                room: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}