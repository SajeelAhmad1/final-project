import prisma from '@/lib/prisma';
import SessionSectionManager from '@/components/SessionSectionManager';

async function getSessionsWithSections() {
  return await prisma.session.findMany({
    include: {
      sections: true
    },
    orderBy: {
      year: 'desc'
    }
  });
}

export default async function SessionManagementPage() {
  const sessions = await getSessionsWithSections();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Session & Section Management</h1>
      </div>
      
      <SessionSectionManager initialSessions={sessions} />
    </div>
  );
}