import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facultyId = params.id;

    if (!facultyId) {
      return NextResponse.json(
        { error: 'Faculty ID is required' },
        { status: 400 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        facultyId: facultyId,
      },
      include: {
        classes: {
          include: {
            section: true,
            room: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch faculty courses' },
      { status: 500 }
    );
  }
}