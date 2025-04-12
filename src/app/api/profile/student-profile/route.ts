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

// GET - Fetch student profile
export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studentProfile = await prisma.student.findFirst({
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
      data: studentProfile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST - Create student profile
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
      rollNumber,
      batch,
      department,
      phone,
      imageUrl,
      streetAddress,
      city,
      state,
      postalCode,
      country
    } = body;

    // Check if profile exists
    const existingProfile = await prisma.student.findFirst({ where: { userId } });
    if (existingProfile) {
      return NextResponse.json(
        { message: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    // Create new profile
    const studentProfile = await prisma.student.create({
      data: {
        firstName,
        lastName,
        rollNumber,
        batch,
        department,
        phone,
        imageUrl,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        userId
      }
    });

    // Update user's profile completion status
    await prisma.user.update({
      where: { id: userId },
      data: { isProfileComplete: true }
    });

    return NextResponse.json(
      { message: 'Profile created successfully', data: studentProfile },
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

// PUT - Update student profile
export async function PUT(request: NextRequest) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const studentProfile = await prisma.student.update({
      where: { userId },
      data: {
        rollNumber: body.rollNumber,
        batch: body.batch,
        department: body.department,
        phone: body.phone,
        imageUrl: body.imageUrl,
        streetAddress: body.streetAddress,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      data: studentProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}