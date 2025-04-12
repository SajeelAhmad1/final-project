'use client';

import { useState } from 'react';

export default function TimetableDisplay({ classes, rooms }: { classes: any[], rooms: any[] }) {
  console.log(classes)
  console.log(rooms)
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewMode, setViewMode] = useState<'room' | 'day'>('day');
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeBlocks = [
    { name: 'Morning', start: '8:30', end: '11:30' },
    { name: 'Afternoon', start: '12:00', end: '15:00' }
  ];

  // Room-wise view data
  const roomSchedule = rooms && rooms.map(room => {
    const roomClasses = classes.filter(c => c.roomId === room.id);
    return {
      room,
      days: days.map(day => ({
        day,
        morningClass: roomClasses.find(c => 
          c.dayOfWeek === day && new Date(c.startTime).getHours() < 12
        ),
        afternoonClass: roomClasses.find(c => 
          c.dayOfWeek === day && new Date(c.startTime).getHours() >= 12
        )
      }))
    };
  });

  // Day-wise view data
const daySchedule = days.map(day => {
  const dayClasses = classes.filter(c => c.dayOfWeek === day);
  return {
    day,
    rooms: rooms.map(room => {
      const roomClasses = dayClasses.filter(c => c.roomId === room.id);
      return {
        room,
        morningClass: roomClasses.find(c => 
          new Date(c.startTime).getHours() < 12
        ),
        afternoonClass: roomClasses.find(c => 
          new Date(c.startTime).getHours() >= 12
        )
      };
    })
  };
});

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {viewMode === 'day' ? 'Daily Schedule' : 'Room Allocation'}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode('room')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'room' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Room View
          </button>
        </div>
      </div>

      {viewMode === 'day' ? (
        // Day-wise View
        <div className="space-y-6">
          <div className="flex space-x-2 mb-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-md ${
                  day === selectedDay ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {daySchedule
            .filter(schedule => schedule.day === selectedDay)
            .map((dayData, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-medium text-lg">{dayData.day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {dayData.rooms.map((roomData, roomIndex) => (
  <div key={roomIndex} className="border rounded-lg p-3">
    <h4 className="font-medium mb-2">
      {roomData.room.name} ({roomData.room.type})
    </h4>
    <div className="space-y-3">
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-sm font-medium">Morning (8:30-11:30)</p>
        {roomData.morningClass ? (
          <div className="mt-1">
            <p>{roomData.morningClass.course?.name}</p>
            <p className="text-sm text-gray-600">
              {roomData.morningClass.section?.name 
                ? `Section ${roomData.morningClass.section.name}` 
                : ''}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Available</p>
        )}
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-sm font-medium">Afternoon (12:00-15:00)</p>
        {roomData.afternoonClass ? (
          <div className="mt-1">
            <p>{roomData.afternoonClass.course?.name}</p>
            <p className="text-sm text-gray-600">
              {roomData.afternoonClass.section?.name 
                ? `Section ${roomData.afternoonClass.section.name}` 
                : ''}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Available</p>
        )}
      </div>
    </div>
  </div>
))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        // Room-wise View
        <div className="space-y-6">
          {roomSchedule && roomSchedule.map((roomData, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium">
                  {roomData.room.name} ({roomData.room.type}, Capacity: {roomData.room.capacity})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
                {roomData.days.map((daySchedule, dayIndex) => (
                  <div key={dayIndex} className="space-y-2">
                    <h4 className="font-medium text-sm">{daySchedule.day}</h4>
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs font-medium">8:30-11:30</p>
                        {daySchedule.morningClass ? (
                          <div className="mt-1">
                            <p className="text-sm">{daySchedule.morningClass.course?.name}</p>
                            <p className="text-xs text-gray-600">
                              {daySchedule.morningClass.section?.name 
                                ? `Sec ${daySchedule.morningClass.section.name}` 
                                : ''}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs">Available</p>
                        )}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <p className="text-xs font-medium">12:00-15:00</p>
                        {daySchedule.afternoonClass ? (
                          <div className="mt-1">
                            <p className="text-sm">{daySchedule.afternoonClass.course?.name}</p>
                            <p className="text-xs text-gray-600">
                              {daySchedule.afternoonClass.section?.name 
                                ? `Sec ${daySchedule.afternoonClass.section.name}` 
                                : ''}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-400 text-xs">Available</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}