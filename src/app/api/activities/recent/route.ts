// src/app/api/activities/recent/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    const formatted = activities.map(user => ({
      action: `New ${user.role.toLowerCase()} registered`,
      details: user.email,
      time: user.createdAt.toISOString()
    }));
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}