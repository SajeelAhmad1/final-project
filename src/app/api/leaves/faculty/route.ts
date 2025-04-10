// src/app/api/faculty/leaves/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'FACULTY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leaves = await prisma.leave.findMany({
      where: { facultyId: user.id },
      orderBy: { startDate: 'desc' },
      take: 5
    });

    return NextResponse.json(leaves);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch faculty leaves' },
      { status: 500 }
    );
  }
}