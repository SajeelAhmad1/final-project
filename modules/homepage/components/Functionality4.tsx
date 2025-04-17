"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import schImg from "@/assets/home/schedule.png"

export default function Functionality4() {
  const router = useRouter();
  return (
    <div className="w-full bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 flex flex-col">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Take Control of Your Academic Time?
          </h2>
          <p className="text-gray-600 mb-8">
            Join the platform today and streamline the way your institution works.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("register/faculty")}
              className="bg-blue-500 text-white px-6 py-2 rounded-md">
              Sign up as Teacher
            </button>
            <button
              onClick={() => router.push("register/student")}
              className="bg-blue-500 text-white px-6 py-2 rounded-md">
              Sign up as Student
            </button>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={schImg.src}
              alt="Students and teachers working together at computers"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}