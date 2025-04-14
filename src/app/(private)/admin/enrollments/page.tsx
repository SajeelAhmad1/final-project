import prisma from '@/lib/prisma';
import { EnrollmentTable } from '@/components/EnrollmentTable';

export default async function EnrollmentManagementPage() {
  const pendingEnrollments = await prisma.enrollment.findMany({
    where: { status: 'PENDING' },
    include: {
      student: {
        include: { user: true }
      },
      course: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Enrollment Requests</h1>
      <EnrollmentTable enrollments={pendingEnrollments} />
    </div>
  );
}