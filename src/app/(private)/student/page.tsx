"use client"
import { useState, useEffect } from 'react';
import { ClipboardList, Calendar, Clock, BookOpen, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

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

type EventType = 'exam' | 'class' | 'assignment';
type EventItemProps = {
  id: string;
  title: string;
  date: string;
  course: string;
  type: EventType;
  status?: 'upcoming' | 'missed' | 'completed';
};

const EventItem = ({ title, date, course, type, status }: EventItemProps) => {
  const iconMap = {
    exam: <Calendar className="h-5 w-5 text-red-500" />,
    class: <Clock className="h-5 w-5 text-blue-500" />,
    assignment: <BookOpen className="h-5 w-5 text-purple-500" />
  };

  const statusIcon = {
    upcoming: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    missed: <XCircle className="h-4 w-4 text-red-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />
  };

  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{course}</p>
        <p className="text-xs text-gray-400 mt-1">{date}</p>
      </div>
      {status && (
        <div className="flex-shrink-0 ml-2">
          {statusIcon[status]}
        </div>
      )}
    </div>
  );
};

export default function StudentDashboard() {
  const [loading, setLoading] = useState({
    courses: true,
    classes: true,
    assignments: true,
    grades: true,
    activities: true,
    events: true
  });
  const {data: session} = useSession();
  
  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItemProps[]>([]);

  // Initialize with default values
const [stats, setStats] = useState({
  courses: 0,
  classesToday: 0,
  pendingAssignments: 0,
  averageGrade: '0.0'
});

const fetchData = async () => {
  try {
    setLoading({
      courses: true,
      classes: true,
      assignments: true,
      grades: true,
      activities: true,
      events: true
    });

    const id = session?.user?.id;
    console.log("here")

    const [
      coursesRes,
      classesRes,
      assignmentsRes,
      gradesRes,
      activitiesRes,
      eventsRes
    ] = await Promise.all([
      fetch(`/api/courses/count/${id}`),
      fetch('/api/classes/today'),
      fetch('/api/student/assignments/pending'),
      fetch('/api/student/grades/average'),
      fetch('/api/student/activities/recent'),
      fetch('/api/student/events/upcoming')
    ]);

    // Handle each response separately
    const coursesData = await coursesRes.json();
    const classesData = await classesRes.json();
    const assignmentsData = await assignmentsRes.json();
    const gradesData = await gradesRes.json();
    const activitiesData = await activitiesRes.json();
    const eventsData = await eventsRes.json();

    setStats({
      courses: coursesData.count || 0,
      classesToday: classesData.count || 0,
      pendingAssignments: assignmentsData.count || 0,
      averageGrade: gradesData.average?.toFixed(1) || '0.0'
    });

    setRecentActivities(activitiesData);
    setUpcomingEvents(eventsData);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    setLoading({
      courses: false,
      classes: false,
      assignments: false,
      grades: false,
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
      title: "Enrolled Courses", 
      value: stats.courses.toString(), 
      icon: <BookOpen className="h-5 w-5" />,
      loading: loading.courses
    },
    { 
      title: "Today's Classes", 
      value: stats.classesToday.toString(), 
      icon: <Clock className="h-5 w-5" />,
      loading: loading.classes
    },
    { 
      title: "Pending Assignments", 
      value: stats.pendingAssignments.toString(), 
      icon: <AlertCircle className="h-5 w-5" />,
      loading: loading.assignments
    },
    { 
      title: "Average Grade", 
      value: stats.averageGrade, 
      icon: <ClipboardList className="h-5 w-5" />,
      loading: loading.grades
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
                    status={event.status}
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