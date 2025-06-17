// lib/services/aiScheduler.ts
import { PrismaClient } from '@prisma/client';
import { ConstraintSatisfactionScheduler } from '../algorithms/constraintSatisfaction';
import { GeneticScheduler } from '../algorithms/geneticAlgorithm';

const prisma = new PrismaClient();

export class AIScheduler {
  async generateTimetable(algorithm = 'genetic') {
    // 1. Fetch all necessary data
    const classes = await prisma.class.findMany({
      where: { status: 'UNSCHEDULED' },
      include: {
        course: { include: { faculty: true } },
        room: true,
        section: { include: { session: true } }
      }
    });
    
    // 2. Apply selected AI algorithm
    let schedule;
    
    if (algorithm === 'genetic') {
      const geneticScheduler = new GeneticScheduler(prisma);
      schedule = await geneticScheduler.generateSchedule();
    } else if (algorithm === 'csp') {
      const cspScheduler = new ConstraintSatisfactionScheduler();
      schedule = await cspScheduler.generateSchedule();
    } else {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
    
    // 3. Update database with generated schedule
    await this.updateScheduleInDatabase(schedule);
    
    return schedule;
  }
  
  async getCurrentSchedule() {
    return prisma.class.findMany({
      where: { status: 'SCHEDULED' },
      include: {
        course: { include: { faculty: true } },
        room: true,
        section: true
      }
    });
  }
  
  private async updateScheduleInDatabase(schedule) {
    // Batch update classes with their new schedule
    const updates = schedule.map(item => 
      prisma.class.update({
        where: { id: item.classId },
        data: {
          roomId: item.roomId,
          startTime: item.startTime || new Date(),
          endTime: item.endTime || new Date(),
          dayOfWeek: item.day,
          status: 'SCHEDULED'
        }
      })
    );
    
    await prisma.$transaction(updates);
  }
}