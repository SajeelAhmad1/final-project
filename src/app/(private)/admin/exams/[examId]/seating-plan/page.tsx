// app/(private)/admin/exams/[examId]/seating-plan/page.tsx
import prisma from '@/lib/prisma';
import { SeatingChart } from '@/components/exams/SeatingChart';

export default async function SeatingPlanPage({ 
  params 
}: { 
  params: { examId: string } 
}) {
  if (!params.examId) {
    return <div className="p-6">Exam ID is required</div>;
  }

  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.examId },
      include: {
        course: true,
        room: true,
        invigilator: true,
        seating: {
          include: {
            student: true
          }
        }
      }
    });

    if (!exam) {
      return <div className="p-6">Exam not founds</div>;
    }

    return (
      <div className="p-6">
        <SeatingChart exam={exam} />
      </div>
    );
  } catch (error) {
    console.error('Failed to load exam:', error);
    return <div className="p-6">Failed to load exam data</div>;
  }
}