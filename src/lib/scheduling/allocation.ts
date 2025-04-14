// src/lib/scheduling/allocation.ts
import prisma from '../prisma';
import { advancedDistribution } from './distribution';
import type { ExamDetails, RoomAllocation } from '@/lib/types';

export async function allocateRoomsForExam(examDetails: ExamDetails) {
  try {
    // 1. Get enrolled students with proper error handling
    const students = await getEnrolledStudents(examDetails.courseId);
    
    // 2. Get available rooms with capacity
    const availableRooms = await getAvailableRooms(examDetails);
    
    // 3. Allocate students to rooms
    const allocation = advancedDistribution(students, availableRooms);

    // 4. Create exam and seating
    return await createExamWithSeating(examDetails, allocation);
  } catch (error) {
    console.error('Exam allocation failed:', error);
    throw error; // Re-throw for route handler
  }
}

async function getEnrolledStudents(courseId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      courseId,
      status: 'APPROVED'
    },
    include: {
      student: true
    }
  });

  if (!enrollments?.length) {
    throw new Error('No approved enrollments found for this course');
  }

  return enrollments.map(e => e.student);
}

async function getAvailableRooms(examDetails: ExamDetails) {
  const rooms = await prisma.room.findMany({
    where: {
      capacity: { gt: 0 },
      // Add date/time availability checks if needed
    },
    orderBy: { capacity: 'desc' }
  });

  if (!rooms?.length) {
    throw new Error('No available exam rooms with capacity');
  }

  return rooms;
}

async function createExamWithSeating(examDetails: ExamDetails, allocation: RoomAllocation[]) {
  return await prisma.$transaction(async (tx) => {
    const exam = await tx.exam.create({
      data: {
        courseId: examDetails.courseId,
        date: examDetails.date,
        duration: examDetails.duration,
        roomId: allocation[0].room.id,
        invigilatorId: examDetails.invigilatorId
      }
    });

    for (const roomAlloc of allocation) {
      const seatNumbers = generateSeatNumbers(
        roomAlloc.room.capacity, 
        roomAlloc.students.length
      );

      await tx.seating.createMany({
        data: roomAlloc.students.map((student, index) => ({
          examId: exam.id,
          studentId: student.id,
          seatNumber: seatNumbers[index],
          // Include batch/department if needed
          batch: student.batch,
          department: student.department
        }))
      });
    }

    return exam;
  });
}

function generateSeatNumbers(capacity: number, count: number): string[] {
  const seats: string[] = [];
  const rows = Math.ceil(capacity / 10); // Assuming 10 seats per row
  
  for (let i = 0; i < count; i++) {
    const row = String.fromCharCode(65 + Math.floor(i / 10));
    const num = (i % 10) + 1;
    seats.push(`${row}${num}`);
  }
  
  return seats;
}