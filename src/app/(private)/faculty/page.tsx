"use client"
import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, Users, CheckCircle, AlertCircle, FileText, BarChart2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  loading?: boolean;
};

const StatCard = ({ title, value, icon, change, loading }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="p-2 rounded-md bg-blue-50 text-blue-600">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      {loading ? (
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      ) : (
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      )}
      {change && (
        <p className="text-xs text-gray-500 mt-1">{change}</p>
      )}
    </div>
  </div>
);

type ActivityItemProps = {
  action: string;
  details: string;
  time: string;
};

const ActivityItem = ({ action, details, time }: ActivityItemProps) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 mt-1 mr-3">
      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{action}</p>
      <p className="text-sm text-gray-500">{details}</p>
    </div>
    <div className="ml-4 text-xs text-gray-400 whitespace-nowrap">
      {formatDistanceToNow(new Date(time))} ago
    </div>
  </div>
);

type EventType = 'class' | 'meeting' | 'deadline' | 'office-hours';
type EventItemProps = {
  id: string;
  title: string;
  date: string;
  course?: string;
  type: EventType;
  location?: string;
};

const EventItem = ({ title, date, course, type, location }: EventItemProps) => {
  const iconMap = {
    class: <BookOpen className="h-5 w-5 text-blue-500" />,
    meeting: <Users className="h-5 w-5 text-purple-500" />,
    deadline: <AlertCircle className="h-5 w-5 text-red-500" />,
    'office-hours': <Clock className="h-5 w-5 text-green-500" />
  };

  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {course && <p className="text-sm text-gray-500">{course}</p>}
        <p className="text-xs text-gray-400 mt-1">{date}</p>
        {location && <p className="text-xs text-gray-400">Location: {location}</p>}
      </div>
    </div>
  );
};

export default function FacultyDashboard() {
  const [loading, setLoading] = useState({
    courses: true,
    students: true,
    classes: true,
    assignments: true,
    activities: true,
    events: true
  });
  
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    classesToday: 0,
    assignmentsToGrade: 0
  });
  
  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItemProps[]>([]);

  const fetchData = async () => {
    try {
      setLoading({
        courses: true,
        students: true,
        classes: true,
        assignments: true,
        activities: true,
        events: true
      });

      // Fetch all data in parallel
      const [
        courses,
        students,
        classesToday,
        assignments,
        activities,
        events
      ] = await Promise.all([
        fetch('/api/faculty/courses').then(res => res.json()),
        fetch('/api/faculty/students').then(res => res.json()),
        fetch('/api/faculty/classes/today').then(res => res.json()),
        fetch('/api/faculty/assignments/tograde').then(res => res.json()),
        fetch('/api/faculty/activities/recent').then(res => res.json()),
        fetch('/api/faculty/events/upcoming').then(res => res.json())
      ]);

      setStats({
        courses: courses.count,
        students: students.count,
        classesToday: classesToday.count,
        assignmentsToGrade: assignments.count
      });

      setRecentActivities(activities);
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading({
        courses: false,
        students: false,
        classes: false,
        assignments: false,
        activities: false,
        events: false
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    { 
      title: "My Courses", 
      value: stats.courses.toString(), 
      icon: <BookOpen className="h-5 w-5" />,
      loading: loading.courses
    },
    { 
      title: "Total Students", 
      value: stats.students.toString(), 
      icon: <Users className="h-5 w-5" />,
      loading: loading.students
    },
    { 
      title: "Today's Classes", 
      value: stats.classesToday.toString(), 
      icon: <Clock className="h-5 w-5" />,
      loading: loading.classes
    },
    { 
      title: "Assignments to Grade", 
      value: stats.assignmentsToGrade.toString(), 
      icon: <FileText className="h-5 w-5" />,
      loading: loading.assignments
    }
  ];

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            loading={stat.loading}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
          </div>
          <div className="p-6">
            <div className="divide-y divide-gray-200">
              {loading.activities ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    action={activity.action}
                    details={activity.details}
                    time={activity.time}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No recent activities found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {loading.events ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventItem
                    key={`${event.type}-${event.id}`}
                    title={event.title}
                    date={event.date}
                    course={event.course}
                    type={event.type}
                    location={event.location}
                  />
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">No upcoming events in the next week</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}