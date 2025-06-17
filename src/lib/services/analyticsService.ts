// lib/services/analyticsService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  async analyzeRoomUtilization() {
    const rooms = await prisma.room.findMany();
    const classes = await prisma.class.findMany({
      where: { status: 'SCHEDULED' }
    });
    
    // Calculate utilization metrics
    const utilization = rooms.map(room => {
      const roomClasses = classes.filter(c => c.roomId === room.id);
      
      // Calculate total hours used
      const totalHoursUsed = roomClasses.reduce((total, c) => {
        const start = new Date(c.startTime);
        const end = new Date(c.endTime);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
      
      // Assuming 8-hour days, 5 days a week
      const totalAvailableHours = 40; 
      
      return {
        roomId: room.id,
        roomName: room.name,
        capacity: room.capacity,
        utilization: (totalHoursUsed / totalAvailableHours) * 100,
        classCount: roomClasses.length
      };
    });
    
    return utilization;
  }
  
  async analyzeFacultyWorkload() {
    // Similar analysis for faculty workload
  }
  
  async analyzeStudentSchedule() {
    // Analysis for student schedule quality
  }
}