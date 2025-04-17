import React from 'react';
import bgImg from "@/assets/home/bg.png"
import sideImg from "@/assets/home/sideImg.png"

export default function AcademicHero() {
  return (
    <div 
      className="w-full bg-blue-800 rounded-xl  relative"
      style={{
        backgroundImage: `url(${bgImg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '500px' // Increased overall height
      }}
    >
      <div className="max-w-6xl pl-12 py-20"> {/* Increased padding for more height */}
        <div className="flex flex-col md:flex-row items-center">
          {/* Left Column - Text Content */}
          <div className="md:w-1/2 text-white mb-8 md:mb-0 z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Smarter Time Management For Smarter Education
            </h1>
            <p className="text-lg mb-8">
              One Platform For Students, Faculty, And Admin To Manage Schedules, Classes, And Exams With Ease.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-800 px-6 py-2 rounded-md font-medium">
                Sign up as Teacher
              </button>
              <button className="bg-white text-blue-800 px-6 py-2 rounded-md font-medium">
                Sign up as Student
              </button>
            </div>
          </div>
          
          {/* Right Column - Image positioned absolutely */}
          <div className="hidden md:block absolute top-0 right-0 bottom-0 w-1/2">
            <img 
              src={sideImg.src} 
              alt="Calendar scheduling on laptop" 
              className="h-full object-cover object-left"
              style={{ 
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile image (shown only on small screens) */}
      <div className="md:hidden w-full mt-4">
        <img 
          src={sideImg.src} 
          alt="Calendar scheduling on laptop" 
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}