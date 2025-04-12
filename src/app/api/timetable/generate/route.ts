import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // 1. Fetch all necessary data
    const [unscheduledClasses, rooms, scheduledClasses] = await Promise.all([
      prisma.class.findMany({
        where: { status: "UNSCHEDULED" },
        include: { course: true, section: true }
      }),
      prisma.room.findMany({
        orderBy: [{ type: 'desc' }, { capacity: 'desc' }] // Hall first, then larger rooms
      }),
      prisma.class.findMany({
        where: { status: "SCHEDULED" },
        select: { roomId: true, dayOfWeek: true, startTime: true, endTime: true }
      })
    ]);

    // 2. Group classes by course (not course-section)
    const courseGroups = unscheduledClasses.reduce((groups, cls) => {
      if (!groups[cls.courseId]) {
        groups[cls.courseId] = {
          course: cls.course,
          classes: [],
          sections: new Set<string>()
        };
      }
      groups[cls.courseId].classes.push(cls);
      if (cls.sectionId) groups[cls.courseId].sections.add(cls.sectionId);
      return groups;
    }, {} as Record<string, any>);

    // 3. Define time blocks and days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeBlocks = [
      { name: 'Morning', start: '08:30', end: '11:30' },
      { name: 'Afternoon', start: '12:00', end: '15:00' }
    ];

    // 4. Track room allocations
    const roomAllocations: Record<string, any> = {};
    days.forEach(day => {
      roomAllocations[day] = {};
      timeBlocks.forEach(block => {
        roomAllocations[day][block.name] = {
          examHall: { available: true, classes: [] },
          rooms: rooms
            .filter(r => r.type !== 'EXAM_HALL')
            .map(room => ({ ...room, available: true }))
        };
      });
    });

    // Mark already booked rooms
    scheduledClasses.forEach(cls => {
      const day = cls.dayOfWeek;
      const blockName = new Date(cls.startTime).getHours() < 12 ? 'Morning' : 'Afternoon';
      const isExamHall = rooms.find(r => r.id === cls.roomId)?.type === 'EXAM_HALL';
      
      if (isExamHall) {
        roomAllocations[day][blockName].examHall.available = false;
      } else {
        const roomIndex = roomAllocations[day][blockName].rooms.findIndex(
          (r: any) => r.id === cls.roomId
        );
        if (roomIndex !== -1) {
          roomAllocations[day][blockName].rooms[roomIndex].available = false;
        }
      }
    });

    // 5. Enhanced scheduling algorithm
    const scheduledResults = [];
    const examHallUsage: Record<string, number> = {}; // Track exam hall usage per course

    // Sort courses by priority (those with more sections first)
    const sortedCourses = Object.values(courseGroups).sort((a: any, b: any) => 
      b.sections.size - a.sections.size || b.classes.length - a.classes.length
    );

    for (const courseData of sortedCourses) {
      const courseId = courseData.course.id;
      examHallUsage[courseId] = 0;
      const classesToSchedule = [...courseData.classes];
      
      // Try to schedule 2 classes in exam hall first
      for (let i = 0; i < Math.min(2, classesToSchedule.length); i++) {
        const cls = classesToSchedule[i];
        let scheduled = false;

        // Try each day and time block
        dayLoop: for (const day of days) {
          for (const block of timeBlocks) {
            if (roomAllocations[day][block.name].examHall.available) {
              const startTime = new Date(`1970-01-01T${block.start}:00`);
              const endTime = new Date(`1970-01-01T${block.end}:00`);

              const updatedClass = await prisma.class.update({
                where: { id: cls.id },
                data: {
                  status: "SCHEDULED",
                  roomId: rooms.find(r => r.type === 'EXAM_HALL')?.id,
                  dayOfWeek: day,
                  startTime,
                  endTime
                }
              });

              scheduledResults.push(updatedClass);
              roomAllocations[day][block.name].examHall.available = false;
              examHallUsage[courseId]++;
              scheduled = true;
              break dayLoop;
            }
          }
        }

        if (scheduled) {
          classesToSchedule.splice(i, 1);
          i--; // Adjust index after removal
        }
      }

      // Schedule remaining classes in regular rooms
      for (const cls of classesToSchedule) {
        let scheduled = false;

        dayLoop: for (const day of days) {
          for (const block of timeBlocks) {
            // Find first available regular room
            const availableRoom = roomAllocations[day][block.name].rooms.find(
              (r: any) => r.available
            );

            if (availableRoom) {
              const startTime = new Date(`1970-01-01T${block.start}:00`);
              const endTime = new Date(`1970-01-01T${block.end}:00`);

              const updatedClass = await prisma.class.update({
                where: { id: cls.id },
                data: {
                  status: "SCHEDULED",
                  roomId: availableRoom.id,
                  dayOfWeek: day,
                  startTime,
                  endTime
                }
              });

              scheduledResults.push(updatedClass);
              availableRoom.available = false;
              scheduled = true;
              break dayLoop;
            }
          }
        }

        // If couldn't schedule in regular rooms, try exam hall as fallback
        if (!scheduled) {
          dayLoop: for (const day of days) {
            for (const block of timeBlocks) {
              if (roomAllocations[day][block.name].examHall.available) {
                const startTime = new Date(`1970-01-01T${block.start}:00`);
                const endTime = new Date(`1970-01-01T${block.end}:00`);

                const updatedClass = await prisma.class.update({
                  where: { id: cls.id },
                  data: {
                    status: "SCHEDULED",
                    roomId: rooms.find(r => r.type === 'EXAM_HALL')?.id,
                    dayOfWeek: day,
                    startTime,
                    endTime
                  }
                });

                scheduledResults.push(updatedClass);
                roomAllocations[day][block.name].examHall.available = false;
                examHallUsage[courseId]++;
                scheduled = true;
                break dayLoop;
              }
            }
          }
        }

        if (!scheduled) {
          console.warn(`Could not schedule class ${cls.id} for course ${courseId}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      scheduledCount: scheduledResults.length,
      examHallUsage,
      message: `Scheduled ${scheduledResults.length} classes across all rooms`
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate timetable',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}