'use client'; 

import ClassForm from '@/components/AddClass';
import TimetableGenerator from '@/components/TimetableGenerator';
import TimetableDisplay from '@/components/TimetableDisplay';
import SessionSectionManager from '@/components/SessionSectionManager';
import { useEffect, useState } from 'react';

export default function TimetableManagementPage() {
  const [data, setData] = useState<{
    unscheduledClasses: any[];
    scheduledClasses: any[];
  }>({ unscheduledClasses: [], scheduledClasses: [] });
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const classData = await res.json();
    setData(classData);
  };

  const fetchRooms = async () => {
    const res = await fetch('/api/rooms');
    const roomsData = await res.json();
    setRooms(roomsData);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/sessions');
    const sessionsData = await res.json();
    setSessions(sessionsData);
  };

  useEffect(() => {
    fetchClasses();
    fetchRooms();
    fetchSessions();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Timetable Management</h1>
      <div className="lg:col-span-1 space-y-6">
          <TimetableGenerator 
            unscheduledClasses={data.unscheduledClasses} 
            rooms={rooms}
            onGenerate={fetchClasses}
          /> 
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        
        <div className="lg:col-span-2">
          <TimetableDisplay rooms={rooms} classes={data.scheduledClasses} />
        </div>
      </div>
    </div>
  );
}