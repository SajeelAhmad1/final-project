import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { examId, studentIds } = await req.json();
  
  // 1. Get exam details
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { room: true }
  });

  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

  // 2. Calculate seats needed
  const seatsNeeded = studentIds.length;
  if (exam.room.capacity < seatsNeeded) {
    return NextResponse.json(
      { error: 'Room capacity exceeded' },
      { status: 400 }
    );
  }

  // 3. Generate seating (simple sequential assignment)
  const seatNumbers = generateSeatNumbers(exam.room.capacity, seatsNeeded);

  // 4. Create seating records
  const seating = await prisma.$transaction(
    studentIds.map((studentId: string, index: number) => 
      prisma.seating.create({
        data: {
          examId,
          studentId,
          seatNumber: seatNumbers[index]
        }
      })
    )
  );

  return NextResponse.json(seating);
}

function generateSeatNumbers(capacity: number, count: number) {
  // Implement your seat numbering logic
  // Example: A1, A2, ..., B1, B2, etc.
}