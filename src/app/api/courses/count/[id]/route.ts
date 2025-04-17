// src/app/api/courses/count/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Count courses with the specific ID (or whatever logic you need)
    // Example 1: Count courses where ID matches
    const count = await prisma.course.count({
      where: { id: id }
    });
    
    // Example 2: Or if you want to count something else related to this ID
    // const count = await prisma.relatedModel.count({
    //   where: { courseId: id }
    // });
    
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to count courses' },
      { status: 500 }
    );
  }
}