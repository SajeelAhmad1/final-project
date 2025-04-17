import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, sessionId } = await request.json();

    // Validate input
    if (!name || !sessionId) {
      return NextResponse.json(
        { error: 'Name and sessionId are required' },
        { status: 400 }
      );
    }

    // Check if section already exists for this session
    const existingSection = await prisma.section.findFirst({
      where: {
        name,
        sessionId
      }
    });

    if (existingSection) {
      return NextResponse.json(
        { error: 'Section with this name already exists for the selected session' },
        { status: 409 }
      );
    }

    // Create new section
    const section = await prisma.section.create({
      data: {
        name,
        sessionId
      }
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create section',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // First delete all classes in this section
    await prisma.class.deleteMany({
      where: { sectionId: id }
    });

    // Then delete the section
    await prisma.section.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}