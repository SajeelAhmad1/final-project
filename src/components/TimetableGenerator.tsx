'use client';

import { useState } from 'react';

export default function TimetableGenerator({ 
  unscheduledClasses,
  rooms,
  onGenerate 
}: { 
  unscheduledClasses: any[],
  rooms: any[],
  onGenerate: () => void 
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    scheduled?: number;
    reset?: number;
    error?: string;
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/timetable/generate', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Generation failed');
      
      setResult({
        success: true,
        scheduled: data.scheduledCount
      });
      onGenerate();
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all schedules? This will clear all room assignments and time slots.')) {
      return;
    }

    setIsResetting(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/timetable/reset', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Reset failed');
      
      setResult({
        success: true,
        reset: data.resetCount
      });
      onGenerate();
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Reset failed'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Timetable Controls</h3>
          <p className="text-sm text-gray-600">
            {unscheduledClasses.length} unscheduled • {rooms && rooms.length} rooms
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className={`px-4 py-2 rounded-md ${
              isResetting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isResetting ? 'Resetting...' : 'Reset All'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || unscheduledClasses.length === 0}
            className={`px-4 py-2 rounded-md text-white ${
              isGenerating ? 'bg-blue-500' :
              unscheduledClasses.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {result && (
        <div className={`p-3 rounded-md ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {result.success ? (
            <>
              {result.scheduled && (
                <p>Successfully scheduled {result.scheduled} classes</p>
              )}
              {result.reset && (
                <p>Reset {result.reset} scheduled classes</p>
              )}
            </>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}