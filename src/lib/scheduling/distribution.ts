// src/lib/scheduling/distribution.ts
import type { Student, Room, RoomAllocation } from '@/lib/types';

export function advancedDistribution(students: Student[], rooms: Room[]): RoomAllocation[] {
  // 1. Parse and group students
  const parsedStudents = students.map(parseStudent);
  const groups = groupStudentsByDepartmentAndBatch(parsedStudents);

  // 2. Initialize room assignments with proper capacity tracking
  const roomAssignments: RoomAllocation[] = rooms.map(room => ({
    room,
    students: [],
    remainingCapacity: room.capacity
  }));

  // 3. Validate we have rooms available
  if (roomAssignments.length === 0) {
    throw new Error('No rooms available for distribution');
  }

  // 4. Spiral distribution algorithm with bounds checking
  Object.values(groups).forEach(group => {
    group.sort((a, b) => a.merit - b.merit);
    
    let forward = true;
    let roomIndex = 0;
    const totalRooms = roomAssignments.length;

    for (const student of group) {
      let attempts = 0;
      const maxAttempts = totalRooms * 2; // Prevent infinite loops
      
      while (attempts < maxAttempts) {
        // Ensure roomIndex is within bounds
        roomIndex = (roomIndex + totalRooms) % totalRooms;
        
        const currentRoom = roomAssignments[roomIndex];
        
        if (currentRoom.remainingCapacity > 0) {
          currentRoom.students.push(student);
          currentRoom.remainingCapacity--;
          break;
        }
        
        // Move in spiral pattern
        roomIndex = forward ? roomIndex + 1 : roomIndex - 1;
        
        // Reverse direction if we hit boundaries
        if (roomIndex >= totalRooms) {
          roomIndex = totalRooms - 1;
          forward = false;
        } else if (roomIndex < 0) {
          roomIndex = 0;
          forward = true;
        }
        
        attempts++;
      }

      if (attempts >= maxAttempts) {
        throw new Error(`Failed to place student ${student.id} after ${maxAttempts} attempts`);
      }
    }
  });

  return roomAssignments.filter(room => room.students.length > 0);
}

// Helper functions remain the same...
function parseStudent(student: Student) {
  const [batch, department, merit] = student.rollNumber.split('-');
  return {
    ...student,
    batch,
    department,
    merit: parseInt(merit)
  };
}

function groupStudentsByDepartmentAndBatch(students: Student[]) {
  return students.reduce((acc, student) => {
    const key = `${student.department}-${student.batch}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {} as Record<string, Student[]>);
}