// src/app/api/events/upcoming/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfToday, addDays } from 'date-fns';

export async function GET() {
  try {
    const today = startOfToday();
    const nextWeek = addDays(today, 7);

    // Fetch upcoming exams
    const exams = await prisma.exam.findMany({
      where: {
        date: {
          gte: today,
          lte: nextWeek
        }
      },
      include: {
        course: true,
        room: true
      },
      orderBy: {
        date: 'asc'
      },
      take: 5
    });

    // Fetch important classes (non-recurring)
    const importantClasses = await prisma.class.findMany({
      where: {
        recurring: false,
        startTime: {
          gte: today,
          lte: nextWeek
        }
      },
      include: {
        course: true,
        room: true
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5
    });

    // Format the events
    const formattedEvents = [
      ...exams.map(exam => ({
        id: exam.id,
        title: `${exam.course.code} Exam`,
        date: exam.date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        location: exam.room.name,
        type: 'exam' as const,
        icon: 'exam'
      })),
      ...importantClasses.map(cls => ({
        id: cls.id,
        title: `${cls.course.code} Special Class`,
        date: cls.startTime.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        location: cls.room?.name || 'TBD',
        type: 'class' as const,
        icon: 'class'
      }))
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}