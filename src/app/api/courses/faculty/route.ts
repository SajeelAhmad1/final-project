// src/app/api/faculty/courses/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'FACULTY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { facultyId: user.id },
      include: {
        classes: {
          orderBy: { startTime: 'asc' },
          take: 5
        },
        enrollments: {
          select: { student: true }
        }
      }
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch faculty courses' },
      { status: 500 }
    );
  }
}