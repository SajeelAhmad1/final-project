import ClassForm from '@/components/AddClass';
import prisma from '@/lib/prisma';

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      course: true,
      room: true
    }
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Class Schedule Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Schedule New Class</h2>
          <ClassForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Scheduled Classes</h2>
          <div className="space-y-4">
            {classes.map(cls => (
              <div key={cls.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{cls.course.name}</h3>
                <p>Room: {cls.room?.name || 'Not assigned'}</p>
                <p>Day: {cls.dayOfWeek}</p>
                <p>Time: {new Date(cls.startTime).toLocaleTimeString()} - {new Date(cls.endTime).toLocaleTimeString()}</p>
                <p>Recurring: {cls.recurring ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}