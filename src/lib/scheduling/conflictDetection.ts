import prisma from "../prisma";

export async function detectExamConflicts(
    studentIds: string[],
    examDate: Date,
    duration: number
  ) {
    // 1. Get all existing exams for these students
    const existingExams = await prisma.seating.findMany({
      where: {
        studentId: { in: studentIds },
        exam: {
          date: {
            // Check for overlapping time slots
            lt: new Date(examDate.getTime() + duration * 60000),
            gt: new Date(examDate.getTime() - duration * 60000)
          }
        }
      },
      include: {
        exam: {
          include: { course: true }
        }
      }
    });
  
    // 2. Group by student
    const conflicts: Record<string, any[]> = {};
    
    existingExams.forEach(seating => {
      if (!conflicts[seating.studentId]) {
        conflicts[seating.studentId] = [];
      }
      conflicts[seating.studentId].push(seating.exam);
    });
  
    // 3. Format results
    return Object.entries(conflicts).map(([studentId, exams]) => ({
      studentId,
      conflicts: exams.map(exam => ({
        courseCode: exam.course.code,
        date: exam.date,
        duration: exam.duration
      }))
    }));
  }