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

    // 5. Enhanced scheduling algorithm with preferred days
    const scheduledResults = [];
    const examHallUsage: Record<string, number> = {};
    const schedulingAlerts: string[] = [];
    const schedulingStats = {
      preferredDayMatched: 0,
      preferredDayNotMatched: 0,
      totalScheduled: 0
    };

    // Sort courses by priority (those with more sections first)
    const sortedCourses = Object.values(courseGroups).sort((a: any, b: any) => 
      b.sections.size - a.sections.size || b.classes.length - a.classes.length
    );

    for (const courseData of sortedCourses) {
      const courseId = courseData.course.id;
      examHallUsage[courseId] = 0;
      const classesToSchedule = [...courseData.classes];
      
      // Try to schedule 2 classes in exam hall first (respecting preferred days)
      for (let i = 0; i < Math.min(2, classesToSchedule.length); i++) {
        const cls = classesToSchedule[i];
        let scheduled = false;

        // Try preferred day first if specified
        if (cls.preferredDay) {
          scheduled = await tryScheduleInExamHall(cls, cls.preferredDay, roomAllocations, scheduledResults, examHallUsage);
          if (scheduled) {
            schedulingStats.preferredDayMatched++;
            classesToSchedule.splice(i, 1);
            i--;
            continue;
          }
        }

        // Try other days if preferred day not available
        dayLoop: for (const day of days) {
          if (cls.preferredDay && day === cls.preferredDay) continue; // Already tried
          
          scheduled = await tryScheduleInExamHall(cls, day, roomAllocations, scheduledResults, examHallUsage);
          if (scheduled) {
            if (cls.preferredDay) {
              schedulingStats.preferredDayNotMatched++;
              schedulingAlerts.push(
                `Class ${cls.course.code} (${cls.section?.name || 'no section'}) ` +
                `could not be scheduled on preferred day (${cls.preferredDay}) ` +
                `and was scheduled in exam hall on ${day} instead`
              );
            }
            classesToSchedule.splice(i, 1);
            i--;
            break dayLoop;
          }
        }
      }

      // Schedule remaining classes in regular rooms (respecting preferred days)
      for (const cls of classesToSchedule) {
        let scheduled = false;

        // Try preferred day first if specified
        if (cls.preferredDay) {
          scheduled = await tryScheduleInRegularRoom(cls, cls.preferredDay, roomAllocations, scheduledResults);
          if (scheduled) {
            schedulingStats.preferredDayMatched++;
            continue;
          }
        }

        // Try other days if preferred day not available
        dayLoop: for (const day of days) {
          if (cls.preferredDay && day === cls.preferredDay) continue; // Already tried
          
          scheduled = await tryScheduleInRegularRoom(cls, day, roomAllocations, scheduledResults);
          if (scheduled) {
            if (cls.preferredDay) {
              schedulingStats.preferredDayNotMatched++;
              schedulingAlerts.push(
                `Class ${cls.course.code} (${cls.section?.name || 'no section'}) ` +
                `could not be scheduled on preferred day (${cls.preferredDay}) ` +
                `and was scheduled in regular room on ${day} instead`
              );
            }
            break dayLoop;
          }
        }

        // Final fallback to exam hall if needed
        if (!scheduled) {
          dayLoop: for (const day of days) {
            scheduled = await tryScheduleInExamHall(cls, day, roomAllocations, scheduledResults, examHallUsage);
            if (scheduled) {
              if (cls.preferredDay) {
                schedulingAlerts.push(
                  `Class ${cls.course.code} (${cls.section?.name || 'no section'}) ` +
                  `could not be scheduled on preferred day (${cls.preferredDay}) ` +
                  `or in any regular room, and was scheduled in exam hall on ${day} instead`
                );
              }
              break dayLoop;
            }
          }
        }

        if (!scheduled) {
          schedulingAlerts.push(
            `Failed to schedule class ${cls.course.code} (${cls.section?.name || 'no section'})`
          );
        }
      }
    }

    schedulingStats.totalScheduled = scheduledResults.length;

    return NextResponse.json({
      success: true,
      scheduledCount: scheduledResults.length,
      examHallUsage,
      alerts: schedulingAlerts,
      stats: schedulingStats,
      message: `Scheduled ${scheduledResults.length} classes`
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

async function tryScheduleInExamHall(
  cls: any,
  day: string,
  roomAllocations: Record<string, any>,
  scheduledResults: any[],
  examHallUsage: Record<string, number>
) {
  const timeBlocks = ['Morning', 'Afternoon'];
  const examHallId = roomAllocations[day]['Morning'].examHall.id;

  for (const block of timeBlocks) {
    if (roomAllocations[day][block].examHall.available) {
      const startTime = new Date(`1970-01-01T${block === 'Morning' ? '08:30' : '12:00'}:00`);
      const endTime = new Date(`1970-01-01T${block === 'Morning' ? '11:30' : '15:00'}:00`);

      await prisma.class.update({
        where: { id: cls.id },
        data: {
          status: "SCHEDULED",
          roomId: examHallId,
          dayOfWeek: day,
          startTime,
          endTime
        }
      });

      scheduledResults.push(cls.id);
      roomAllocations[day][block].examHall.available = false;
      examHallUsage[cls.courseId] = (examHallUsage[cls.courseId] || 0) + 1;
      return true;
    }
  }
  return false;
}

async function tryScheduleInRegularRoom(
  cls: any,
  day: string,
  roomAllocations: Record<string, any>,
  scheduledResults: any[]
) {
  const timeBlocks = ['Morning', 'Afternoon'];

  for (const block of timeBlocks) {
    const availableRoom = roomAllocations[day][block].rooms.find((r: any) => r.available);
    if (availableRoom) {
      const startTime = new Date(`1970-01-01T${block === 'Morning' ? '08:30' : '12:00'}:00`);
      const endTime = new Date(`1970-01-01T${block === 'Morning' ? '11:30' : '15:00'}:00`);

      await prisma.class.update({
        where: { id: cls.id },
        data: {
          status: "SCHEDULED",
          roomId: availableRoom.id,
          dayOfWeek: day,
          startTime,
          endTime
        }
      });

      scheduledResults.push(cls.id);
      availableRoom.available = false;
      return true;
    }
  }
  return false;
}