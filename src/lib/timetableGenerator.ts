import { Class, Room } from '@prisma/client';

interface ScheduledClass extends Class {
  startTime: Date;
  endTime: Date;
  dayOfWeek: string;
  roomId: string;
}

export async function generateTimetable(
  unscheduledClasses: (Class & { course: { faculty: { id: string } | null } })[],
  rooms: Room[]
): Promise<ScheduledClass[]> {
  // Implement your scheduling algorithm here
  // This example uses a simple round-robin assignment
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { start: 9, end: 10 },  // 9am-10am
    { start: 10, end: 11 }, // 10am-11am
    // ... add more time slots
  ];

  const scheduledClasses: ScheduledClass[] = [];
  let dayIndex = 0;
  let timeSlotIndex = 0;
  let roomIndex = 0;

  for (const cls of unscheduledClasses) {
    // Get current day and time slot
    const day = days[dayIndex % days.length];
    const timeSlot = timeSlots[timeSlotIndex % timeSlots.length];
    const room = rooms[roomIndex % rooms.length];

    // Create scheduled class
    const startTime = new Date();
    startTime.setHours(timeSlot.start, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(timeSlot.end, 0, 0, 0);

    scheduledClasses.push({
      ...cls,
      startTime,
      endTime,
      dayOfWeek: day,
      roomId: room.id,
      recurring: true
    });

    // Move to next slot
    roomIndex++;
    if (roomIndex >= rooms.length) {
      timeSlotIndex++;
      if (timeSlotIndex >= timeSlots.length) {
        dayIndex++;
      }
    }
  }

  return scheduledClasses;
}