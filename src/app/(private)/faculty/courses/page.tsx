"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, Clock, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

type Course = {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  classes: {
    id: string;
    dayOfWeek: string | null;
    startTime: Date | null;
    endTime: Date | null;
    room: {
      name: string;
    } | null;
    section: {
      name: string;
    } | null;
  }[];
};

export default function FacultyCourses() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!session?.user?.id) return;

        setLoading(true);
        const id = session?.user?.id
        const response = await fetch(`/api/courses/${id}/courses`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage all courses assigned to you
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No courses assigned</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't been assigned to any courses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {course.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.code} • {course.credits} credits
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {course.department}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {course.classes.length > 0 ? (
                    course.classes.map((classItem) => (
                      <div key={classItem.id} className="border-t border-gray-200 pt-4">
                        <div className="flex items-center space-x-3 text-sm">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span>
                            {classItem.dayOfWeek || 'Not scheduled'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm mt-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span>
                            {classItem.startTime
                              ? `${new Date(classItem.startTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })} - ${new Date(classItem.endTime!).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}`
                              : 'No time set'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm mt-2">
                          <Users className="h-5 w-5 text-gray-400" />
                          <span>
                            {classItem.section?.name || 'No section'} •{' '}
                            {classItem.room?.name || 'No room'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                      No classes scheduled for this course
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    href={`/faculty/courses/${course.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}