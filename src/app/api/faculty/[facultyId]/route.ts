import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { facultyId: string } }
) {
  try {
    const { facultyId } = params;

    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
      include: {
        user: {
          select: {
            email: true,
            verified: true,
            createdAt: true,
          },
        },
        courses: {
          select: {
            id: true,
            code: true,
            name: true,
            department: true,
            credits: true,
          },
        },
        leaves: {
          include: {
            substitute: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        invigilations: {
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
    });

    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }

    return NextResponse.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}