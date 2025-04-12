'use client';

import { useState } from 'react';
import { Session, Section } from '@prisma/client';

export type SessionWithSections = Session & {
  sections: Section[];
};

interface SessionSectionManagerProps {
  initialSessions: SessionWithSections[];
}

export default function SessionSectionManager({ initialSessions }: SessionSectionManagerProps) {
  const [sessions, setSessions] = useState<SessionWithSections[]>(initialSessions || []);
  const [newSession, setNewSession] = useState('');
  const [newSection, setNewSection] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSession = async () => {
    if (!newSession.trim()) {
      setError('Please enter a session year');
      return;
    }

    const yearNumber = Number(newSession);
    if (isNaN(yearNumber)) {
      setError('Year must be a valid number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: yearNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add session');
      }

      setSessions([data, ...sessions]);
      setNewSession('');
    } catch (err) {
      console.error('Error adding session:', err);
      setError(err instanceof Error ? err.message : 'Failed to add session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.trim()) {
      setError('Please enter a section name');
      return;
    }

    if (!selectedSession) {
      setError('Please select a session');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newSection.trim(),
          sessionId: selectedSession
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add section');
      }

      setSessions(sessions.map(session => 
        session.id === selectedSession
          ? { ...session, sections: [...session.sections, data] }
          : session
      ));
      setNewSection('');
    } catch (err) {
      console.error('Error adding section:', err);
      setError(err instanceof Error ? err.message : 'Failed to add section');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session and all its sections?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      setSessions(sessions.map(session => ({
        ...session,
        sections: session.sections.filter(s => s.id !== sectionId)
      })));
    } catch (err) {
      console.error('Error deleting section:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete section');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {error && (
        <div className="bg-red-100 text-red-700 p-4">
          {error}
        </div>
      )}

      {/* Add Session Section */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Add New Session</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            placeholder="Enter session year (e.g., 2024)"
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleAddSession}
            disabled={isLoading || !newSession.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Adding...' : 'Add Session'}
          </button>
        </div>
      </div>

      {/* Add Section Section */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Add New Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || sessions.length === 0}
          >
            <option value="">Select Session</option>
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.year}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder="Section name (e.g., A)"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || !selectedSession}
          />
          <button
            onClick={handleAddSection}
            disabled={isLoading || !newSection.trim() || !selectedSession}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Adding...' : 'Add Section'}
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="divide-y">
        {sessions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No sessions created yet. Add your first session above.
          </div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">
                  Session: <span className="text-blue-600">{session.year}</span>
                </h3>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:bg-gray-200"
                >
                  Delete Session
                </button>
              </div>

              {session.sections.length === 0 ? (
                <p className="text-sm text-gray-500">No sections for this session</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {session.sections.map(section => (
                    <div key={section.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span className="font-medium">Section {section.name}</span>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        disabled={isLoading}
                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:bg-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}