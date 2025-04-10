// src/app/faculty/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

type CourseCardProps = {
  code: string;
  name: string;
  studentCount: number;
  nextClass?: string;
  loading?: boolean;
};

const CourseCard = ({ code, name, studentCount, nextClass, loading }: CourseCardProps) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium text-gray-500">{code}</h3>
      <div className="p-2 rounded-md bg-blue-50 text-blue-600">
        <BookOpen className="h-5 w-5" />
      </div>
    </div>
    <div className="mt-2">
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">Students: {studentCount}</p>
          {nextClass && (
            <p className="text-xs text-gray-400 mt-1">Next class: {nextClass}</p>
          )}
        </>
      )}
    </div>
  </div>
);

type LeaveItemProps = {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

const LeaveItem = ({ startDate, endDate, reason, status }: LeaveItemProps) => {
  const statusIcons = {
    PENDING: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    APPROVED: <CheckCircle className="h-5 w-5 text-green-500" />,
    REJECTED: <XCircle className="h-5 w-5 text-red-500" />
  };

  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        {statusIcons[status]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </p>
        <p className="text-sm text-gray-500">{reason}</p>
        <p className="text-xs text-gray-400 mt-1 capitalize">{status.toLowerCase()}</p>
      </div>
    </div>
  );
};

type ClassItemProps = {
  courseCode: string;
  startTime: Date;
  endTime: Date;
  room: string;
};

const ClassItem = ({ courseCode, startTime, endTime, room }: ClassItemProps) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 mr-3 text-blue-500">
      <Clock className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{courseCode}</p>
      <p className="text-sm text-gray-500">
        {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
      </p>
      <p className="text-xs text-gray-400 mt-1">Room: {room}</p>
    </div>
  </div>
);

export default function FacultyDashboard() {
  const [loading, setLoading] = useState({
    courses: true,
    leaves: true,
    classes: true
  });

  const [courses, setCourses] = useState<{
    code: string;
    name: string;
    enrollments: { student: any }[];
    classes: { startTime: Date }[];
  }[]>([]);

  const [leaves, setLeaves] = useState<LeaveItemProps[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItemProps[]>([]);

  const fetchData = async () => {
    try {
      setLoading({
        courses: true,
        leaves: true,
        classes: true
      });

      const [coursesRes, leavesRes, classesRes] = await Promise.all([
        fetch('/api/courses/faculty'),
        fetch('/api/leaves/faculty'),
        fetch('/api/events/upcoming/faculty-classes')
      ]);

      const coursesData = await coursesRes.json();
      const leavesData = await leavesRes.json();
      const classesData = await classesRes.json();

      setCourses(coursesData);
      setLeaves(leavesData);
      setUpcomingClasses(classesData.map((cls: any) => ({
        courseCode: cls.course.code,
        startTime: cls.startTime,
        endTime: cls.endTime,
        room: cls.room?.name || 'TBD'
      })));
    } catch (error) {
      console.error('Failed to fetch faculty data:', error);
    } finally {
      setLoading({
        courses: false,
        leaves: false,
        classes: false
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
        <button 
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => fetchData()}
        >
          Refresh Data
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* My Courses */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">My Courses</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading.courses ? (
                [...Array(3)].map((_, i) => (
                  <CourseCard 
                    key={i}
                    code="Loading"
                    name="Loading"
                    studentCount={0}
                    loading
                  />
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard
                    key={course.code}
                    code={course.code}
                    name={course.name}
                    studentCount={course.enrollments.length}
                    nextClass={course.classes[0] ? 
                      format(course.classes[0].startTime, 'MMM d, h:mm a') : 
                      'No upcoming classes'
                    }
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-4">
                  <p className="text-sm text-gray-500">No courses assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Classes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading.classes ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))
              ) : upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls, index) => (
                  <ClassItem
                    key={index}
                    courseCode={cls.courseCode}
                    startTime={cls.startTime}
                    endTime={cls.endTime}
                    room={cls.room}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No upcoming classes this week</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Leaves */}
        <div className="bg-white rounded-lg shadow lg:col-span-3">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">My Leave Requests</h2>
          </div>
          <div className="p-6">
            <div className="divide-y divide-gray-200">
              {loading.leaves ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))
              ) : leaves.length > 0 ? (
                leaves.map((leave) => (
                  <LeaveItem
                    key={leave.id}
                    startDate={new Date(leave.startDate)}
                    endDate={new Date(leave.endDate)}
                    reason={leave.reason}
                    status={leave.status}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No leave requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}