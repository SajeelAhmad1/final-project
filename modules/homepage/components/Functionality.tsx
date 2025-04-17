import React from 'react';
import examImg from "@/assets/home/exam.png"

export default function Functionality() {
  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">
          Automate Exams And Class Schedules
        </h1>
        <p className="text-gray-600 text-base max-w-2xl mx-auto">
          From Seat Planning To Weekly Class Schedules, Our System Handles Complex Academic Timelines Effortlessly.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center gap-8 my-6">
        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden">
            <img
              src={examImg.src}
              alt="Digital technology interface showing scheduling system"
              className="w-full object-cover rounded-[20px] h-[350px]"
              style={{
                backgroundImage: "linear-gradient(45deg, #0c4a6e, #0ea5e9)",
              }}
            />
          </div>
        </div>

        <div className="md:w-1/2 space-y-6">
          <div className="flex items-center gap-4 bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg">Schedule exams by session/class</span>
          </div>

          <div className="flex items-center gap-4 bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg">Auto-generate seating plans</span>
          </div>

          <div className="flex items-center gap-4 bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1" fill="currentColor" />
                <circle cx="8" cy="18" r="1" fill="currentColor" />
                <circle cx="16" cy="18" r="1" fill="currentColor" />
                <circle cx="12" cy="14" r="1" fill="currentColor" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg">Timetable generation based on availability</span>
          </div>

          <div className="flex items-center gap-4 bg-[#F5FCFF] p-4 rounded-lg">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg">Conflict-free scheduling</span>
          </div>
        </div>
      </div>
    </div>
  );
}