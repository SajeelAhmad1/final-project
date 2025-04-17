import React from 'react';

export default function Functionality2() {
  return (
    <div className="w-full bg-blue-400 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">
            Automate Exams And Class Schedules
          </h1>
          <p className="text-white text-base max-w-2xl mx-auto">
            From Seat Planning To Weekly Class Schedules, Our System Handles Complex Academic Timelines Effortlessly.
          </p>
        </div>

        {/* Feature Boxes */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {/* Student Features Box */}
          <div className="bg-white rounded-lg p-6 flex-1">
            <h2 className="text-xl font-bold mb-4">Student Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>View enrolled courses</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>Check timetable & seating plan</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>Register and log in</span>
              </li>
            </ul>
          </div>

          {/* Teacher Features Box */}
          <div className="bg-white rounded-lg p-6 flex-1">
            <h2 className="text-xl font-bold mb-4">Teacher Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>View assigned courses</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>Check messages & requests</span>
              </li>
              <li className="flex items-start">
                <span className="text-black mr-2">▶</span>
                <span>Approve/reject student leaves</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}