import prisma from '@/lib/prisma';
import { SchedulingForm } from '@/components/exams/SchedulingForm';

export default async function ExamSchedulePage() {
  const [courses, faculty] = await Promise.all([
    prisma.course.findMany({
      include: { enrollments: true }
    }),
    prisma.faculty.findMany()
  ]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule New Exam</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <SchedulingForm 
          courses={courses} 
          faculty={faculty} 
        />
      </div>
    </div>
  );
}