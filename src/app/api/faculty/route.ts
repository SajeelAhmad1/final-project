import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';

export async function GET(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    
    // Check if user is admin
    // if (session?.user.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '';
    const department = searchParams.get('department') || '';
    const designation = searchParams.get('designation') || '';

    const faculties = await prisma.faculty.findMany({
      where: {
        AND: [
          {
            OR: [
              { department: { contains: searchTerm, mode: 'insensitive' } },
              { designation: { contains: searchTerm, mode: 'insensitive' } },
              {
                user: {
                  email: { contains: searchTerm, mode: 'insensitive' }
                }
              }
            ]
          },
          department ? { department: { equals: department, mode: 'insensitive' } } : {},
          designation ? { designation: { equals: designation, mode: 'insensitive' } } : {}
        ]
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        user: {
          email: 'asc'
        }
      }
    });

    return NextResponse.json(faculties);
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}