import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return null;
  }
  return session.user.id;
}

// GET - Fetch faculty profile
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const facultyProfile = await prisma.faculty.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Profile fetched successfully',
      data: facultyProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST - Create faculty profile
export async function POST(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      firstName,
      lastName,
      department,
      designation,
      phone,
      imageUrl
    } = body;

    // Check if profile exists
    const existingProfile = await prisma.faculty.findFirst({ where: { userId } });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    // Create new profile
    const facultyProfile = await prisma.faculty.create({
      data: {
        firstName,
        lastName,
        department,
        designation,
        phone,
        imageUrl,
        userId
      }
    });

    // Update user's profile completion status
    await prisma.user.update({
      where: { id: userId },
      data: { isProfileComplete: true }
    });

    return NextResponse.json(
      { message: 'Profile created successfully', data: facultyProfile },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { message: 'Failed to create profile' },
      { status: 500 }
    );
  }
}

// PUT - Update faculty profile
export async function PUT(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const facultyProfile = await prisma.faculty.update({
      where: { userId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        department: body.department,
        designation: body.designation,
        phone: body.phone,
        imageUrl: body.imageUrl
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: facultyProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}