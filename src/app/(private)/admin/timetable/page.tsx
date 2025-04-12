'use client'; // This marks the component as a Client Component

import ClassForm from '@/components/AddClass';
import TimetableGenerator from '@/components/TimetableGenerator';
import TimetableDisplay from '@/components/TimetableDisplay';
import SessionSectionManager from '@/components/SessionSectionManager';
import { useEffect, useState } from 'react';

export default function TimetableManagementPage() {
  const [data, setData] = useState<{
    unscheduledClasses: any[];
    scheduledClasses: any[];
    rooms: any[];
  }>({ unscheduledClasses: [], scheduledClasses: [], rooms: [] });
  
  const [sessions, setSessions] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch('/api/classes');
    const newData = await res.json();
    setData(newData);
  };

  const fetchSessions = async () => {
    const res = await fetch('/api/sessions');
    const sessionsData = await res.json();
    setSessions(sessionsData);
  };

  useEffect(() => {
    fetchData();
    fetchSessions();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Timetable Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <SessionSectionManager initialSessions={sessions} />
          <ClassForm onSuccess={fetchData} />
          <TimetableGenerator 
            unscheduledClasses={data.unscheduledClasses} 
            rooms={data.rooms}
            onGenerate={fetchData}
          />
        </div>
        
        <div className="lg:col-span-2">
          <TimetableDisplay classes={data.scheduledClasses} />
        </div>
      </div>
    </div>
  );
}