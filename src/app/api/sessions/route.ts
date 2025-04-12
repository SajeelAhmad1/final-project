import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        sections: true
      },
      orderBy: {
        year: 'desc'
      }
    });
    
    // Transform the data to match what your frontend expects
    const response = {
      sessions: sessions.map(session => ({
        id: session.id,
        year: Number(session.year) // Convert string to number if needed
      })),
      sections: sessions.flatMap(session => 
        session.sections.map(section => ({
          ...section,
          sessionId: session.id
        })))
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { year } = await request.json();

    // Validate input
    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      );
    }

    const yearNumber = Number(year);
    if (isNaN(yearNumber)) {
      return NextResponse.json(
        { error: 'Year must be a valid number' },
        { status: 400 }
      );
    }

    // Check if session already exists
    const existingSession = await prisma.session.findUnique({
      where: { year: String(yearNumber) }
    });

    if (existingSession) {
      return NextResponse.json(
        { error: 'Session with this year already exists' },
        { status: 409 }
      );
    }

    // Create new session
    const session = await prisma.session.create({
      data: { 
        year: String(yearNumber)
      },
      include: {
        sections: true
      }
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create session',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Delete all sections first (due to foreign key constraint)
    await prisma.section.deleteMany({
      where: { sessionId: id }
    });

    // Then delete the session
    await prisma.session.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}