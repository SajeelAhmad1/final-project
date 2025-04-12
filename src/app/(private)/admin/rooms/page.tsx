import RoomForm from '@/components/AddRooms';
import prisma from '@/lib/prisma';

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Room Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
          <RoomForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Rooms</h2>
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{room.name}</h3>
                <p>Type: {room.type}</p>
                <p>Capacity: {room.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}