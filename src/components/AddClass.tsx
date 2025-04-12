'use client';

import { useState, useEffect } from 'react';

type Course = {
  id: string;
  code: string;
  name: string;
};

type Room = {
  id: string;
  name: string;
  type: string;
  capacity: number;
};

type Session = {
  id: string;
  year: number;
};

type Section = {
  id: string;
  name: string;
  sessionId: string;
};

type FormData = {
  courseId: string;
  roomId: string;
  sessionId: string;
  sectionId: string;
};

export default function ClassForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    courseId: '',
    roomId: '',
    sessionId: '',
    sectionId: ''
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [coursesRes, roomsRes, sessionsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/rooms'),
          fetch('/api/sessions')
        ]);

        if (!coursesRes.ok || !roomsRes.ok || !sessionsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [coursesData, roomsData, sessionsData] = await Promise.all([
          coursesRes.json(),
          roomsRes.json(),
          sessionsRes.json()
        ]);

        setCourses(coursesData);
        setRooms(roomsData);
        setSessions(sessionsData.sessions || []);
        setSections(sessionsData.sections || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.sessionId) {
      setFilteredSections(sections.filter(s => s.sessionId === formData.sessionId));
      // Reset section if it's no longer valid for the selected session
      if (formData.sectionId && !sections.some(s => s.id === formData.sectionId && s.sessionId === formData.sessionId)) {
        setFormData(prev => ({ ...prev, sectionId: '' }));
      }
    } else {
      setFilteredSections([]);
    }
  }, [formData.sessionId, sections, formData.sectionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.courseId || !formData.sessionId || !formData.sectionId) {
        throw new Error('Please fill all required fields');
      }

      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create class');
      }
      
      // Reset form on success
      setFormData({ 
        courseId: '', 
        roomId: '', 
        sessionId: '', 
        sectionId: '' 
      });
      onSuccess();
    } catch (err) {
      console.error('Error creating class:', err);
      setError(err instanceof Error ? err.message : 'Failed to create class');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Session*</label>
          <select
            value={formData.sessionId}
            onChange={(e) => setFormData({
              ...formData, 
              sessionId: e.target.value,
              sectionId: '' // Reset section when session changes
            })}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          >
            <option value="">Select Session</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.year}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Section*</label>
          <select
            value={formData.sectionId}
            onChange={(e) => setFormData({...formData, sectionId: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!formData.sessionId || isSubmitting}
          >
            <option value="">Select Section</option>
            {filteredSections.map(s => (
              <option key={s.id} value={s.id}>
                Section {s.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Course*</label>
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({...formData, courseId: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          >
            <option value="">Select Course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Room</label>
          <select
            value={formData.roomId}
            onChange={(e) => setFormData({...formData, roomId: e.target.value})}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value="">No preference</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type}, Cap: {r.capacity})
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : 'Add Class'}
        </button>
      </div>
    </form>
  );
}