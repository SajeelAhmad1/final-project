import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  // if (!user || user.role !== 'ADMIN') {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const { status } = await req.json();

  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: params.id },
      data: { status },
      include: {
        student: {
          include: { user: true }
        },
        course: true
      }
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Enrollment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}