import prisma from "../prisma";

type ExamDetails = {
  courseId: string;
  date: DateTime;
  duration: number;
};

export async function allocateRoomsForExam(examDetails: ExamDetails) {
  // 1. Get all enrolled students for this exam
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: examDetails.courseId },
    include: {
      student: {
        include: { user: true }
      }
    }
  });

  // 2. Parse student metadata from roll numbers
  const students = enrollments.map(enrollment => {
    const [batch, department, merit] = enrollment.student.rollNumber.split('-');
    return {
      ...enrollment.student,
      batch,
      department,
      merit: parseInt(merit)
    };
  });

  // 3. Get available exam rooms (sorted by capacity descending)
  const availableRooms = await prisma.room.findMany({
    where: {
      type: 'EXAM_HALL',
      // Add availability check for examDetails.date and duration
    },
    orderBy: { capacity: 'desc' }
  });

  // 4. Core allocation algorithm
  const allocation = distributeStudents(students, availableRooms);

  // 5. Create exam records and seating assignments
  await createExamWithSeating(examDetails, allocation);
}

function distributeStudents(students: any[], rooms: any[]) {
  // Sort students to distribute intelligently
  const sortedStudents = [...students]
    .sort((a, b) => {
      // Primary sort by department, then batch, then merit
      if (a.department !== b.department) return a.department.localeCompare(b.department);
      if (a.batch !== b.batch) return a.batch.localeCompare(b.batch);
      return a.merit - b.merit;
    });

  // Initialize room tracking
  const roomAssignments = rooms.map(room => ({
    room,
    students: [] as any[],
    remainingCapacity: room.capacity
  }));

  // Round-robin distribution for maximum separation
  for (const student of sortedStudents) {
    let assigned = false;
    
    // Try to place in first available room with capacity
    for (const room of roomAssignments) {
      if (room.remainingCapacity > 0) {
        room.students.push(student);
        room.remainingCapacity--;
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      throw new Error('Insufficient room capacity for exam');
    }
  }

  return roomAssignments.filter(room => room.students.length > 0);
}

async function createExamWithSeating(examDetails: ExamDetails, allocation: any[]) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the base exam record
    const exam = await tx.exam.create({
      data: {
        courseId: examDetails.courseId,
        date: examDetails.date,
        duration: examDetails.duration,
        roomId: allocation[0].room.id // Primary room
      }
    });

    // 2. Create seating assignments for all rooms
    for (const roomAlloc of allocation) {
      const seatNumbers = generateSeatNumbers(
        roomAlloc.room.capacity, 
        roomAlloc.students.length
      );

      await Promise.all(
        roomAlloc.students.map((student: any, index: number) => 
          tx.seating.create({
            data: {
              examId: exam.id,
              studentId: student.id,
              seatNumber: seatNumbers[index],
              // Additional metadata can be stored here
              metadata: {
                batch: student.batch,
                department: student.department,
                merit: student.merit
              }
            }
          })
        )
      );
    }

    return exam;
  });
}

function generateSeatNumbers(roomCapacity: number, studentCount: number): string[] {
  const rows = Math.ceil(roomCapacity / 10); // Assuming 10 seats per row
  const seats: string[] = [];
  
  for (let i = 0; i < studentCount; i++) {
    const row = String.fromCharCode(65 + Math.floor(i / 10)); // A, B, C, etc.
    const num = (i % 10) + 1;
    seats.push(`${row}${num}`);
  }
  
  return seats;
}