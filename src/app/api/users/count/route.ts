// src/app/api/users/count/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  
  try {
    const where: any = {};
    if (role) where.role = role.toUpperCase();
    
    const count = await prisma.user.count({ where });
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to count users' },
      { status: 500 }
    );
  }
}