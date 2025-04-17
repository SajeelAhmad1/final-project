import React from 'react';

export default function Functionality3() {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto py-12 px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          Manage Courses, Rooms, And Classes With Ease
        </h1>
        <p className="text-gray-600 text-base">
          Create And Assign Classes, Manage Rooms, And Organize Everything With Smart Control.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Card 1 - Add/Delete Courses */}
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-center">Add/Delete Courses</h2>
        </div>

        {/* Card 2 - Assign To Faculty */}
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-center">Assign To Faculty</h2>
        </div>

        {/* Card 3 - Manage Room Availability */}
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-center">Manage Room Availability</h2>
        </div>

        {/* Card 4 - Auto-Sync With Timetable & Exams */}
        <div className="bg-gray-50 rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col items-center">
          <div className="text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="font-bold text-xl text-center">Auto-Sync With Timetable & Exams</h2>
        </div>
      </div>
    </div>
  );
}