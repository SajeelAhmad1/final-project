// src/app/api/faculty/upcoming-classes/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { startOfToday, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'FACULTY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = startOfToday();
    const weekEnd = endOfWeek(today);

    const classes = await prisma.class.findMany({
      where: {
        course: { facultyId: user.id },
        startTime: {
          gte: today,
          lte: weekEnd
        }
      },
      include: {
        course: true,
        room: true
      },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch upcoming classes' },
      { status: 500 }
    );
  }
}