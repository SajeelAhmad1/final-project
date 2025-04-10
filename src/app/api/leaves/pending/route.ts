// src/app/api/leaves/pending/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.leave.count({
      where: { status: 'PENDING' }
    });
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to count pending leaves' },
      { status: 500 }
    );
  }
}