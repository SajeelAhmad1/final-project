// app/api/scheduler/constraints/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const constraint = await prisma.schedulingConstraint.create({
      data: body
    });
    
    return NextResponse.json({ success: true, constraint });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const constraints = await prisma.schedulingConstraint.findMany();
    
    return NextResponse.json(constraints);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}