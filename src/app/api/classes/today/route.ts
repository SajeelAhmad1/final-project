// src/app/api/classes/today/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET() {
  try {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    
    const count = await prisma.class.count({
      where: {
        startTime: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to count today\'s classes' },
      { status: 500 }
    );
  }
}