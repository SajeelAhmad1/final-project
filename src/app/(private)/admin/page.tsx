// src/app/admin/page.tsx
"use client"
import { useState, useEffect } from 'react';
import { Calendar, Clock, GraduationCap, Users, BookOpen, AlertCircle, Plus } from 'lucide-react';
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

type EventType = 'exam' | 'class' | 'deadline';
type EventItemProps = {
  id: string;
  title: string;
  date: string;
  location?: string;
  type: EventType;
};

const EventItem = ({ title, date, location, type }: EventItemProps) => {
  const iconMap = {
    exam: <Calendar className="h-5 w-5 text-red-500" />,
    class: <Clock className="h-5 w-5 text-blue-500" />,
    deadline: <AlertCircle className="h-5 w-5 text-yellow-500" />
  };

  return (
    <div className="flex items-start py-3">
      <div className="flex-shrink-0 mr-3">
        {iconMap[type]}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
        {location && (
          <p className="text-xs text-gray-400 mt-1">Location: {location}</p>
        )}
      </div>
    </div>
  );
};

type UserRoleFilter = 'ALL' | 'ADMIN' | 'FACULTY' | 'STUDENT';

export default function AdminDashboard() {
  const [userRoleFilter, setUserRoleFilter] = useState<UserRoleFilter>('ALL');
  const [loading, setLoading] = useState({
    users: true,
    courses: true,
    classes: true,
    leaves: true,
    activities: true,
    events: true
  });
  
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    classes: 0,
    leaves: 0,
    usersByRole: {
      ADMIN: 0,
      FACULTY: 0,
      STUDENT: 0
    }
  });
  
  const [recentActivities, setRecentActivities] = useState<ActivityItemProps[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItemProps[]>([]);

  const fetchData = async () => {
    try {
      setLoading({
        users: true,
        courses: true,
        classes: true,
        leaves: true,
        activities: true,
        events: true
      });

      // Fetch all data in parallel
      const [
        totalUsers, 
        adminUsers, 
        facultyUsers, 
        studentUsers,
        courses,
        classes,
        leaves,
        activities,
        events
      ] = await Promise.all([
        fetch('/api/users/count').then(res => res.json()),
        fetch('/api/users/count?role=admin').then(res => res.json()),
        fetch('/api/users/count?role=faculty').then(res => res.json()),
        fetch('/api/users/count?role=student').then(res => res.json()),
        fetch('/api/courses/count').then(res => res.json()),
        fetch('/api/classes/today').then(res => res.json()),
        fetch('/api/leaves/pending').then(res => res.json()),
        fetch('/api/activities/recent').then(res => res.json()),
        fetch('/api/events/upcoming').then(res => res.json())
      ]);

      setStats({
        users: totalUsers.count,
        courses: courses.count,
        classes: classes.count,
        leaves: leaves.count,
        usersByRole: {
          ADMIN: adminUsers.count,
          FACULTY: facultyUsers.count,
          STUDENT: studentUsers.count
        }
      });

      setRecentActivities(activities);
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading({
        users: false,
        courses: false,
        classes: false,
        leaves: false,
        activities: false,
        events: false
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [userRoleFilter]);

  const filteredUserCount = userRoleFilter === 'ALL' 
    ? stats.users 
    : stats.usersByRole[userRoleFilter];

  const statCards = [
    { 
      title: "Total Users", 
      value: filteredUserCount.toLocaleString(), 
      icon: <Users className="h-5 w-5" />,
      change: `Admin: ${stats.usersByRole.ADMIN}, Faculty: ${stats.usersByRole.FACULTY}, Students: ${stats.usersByRole.STUDENT}`,
      loading: loading.users
    },
    { 
      title: "Active Courses", 
      value: stats.courses.toLocaleString(), 
      icon: <BookOpen className="h-5 w-5" />,
      loading: loading.courses
    },
    { 
      title: "Today's Classes", 
      value: stats.classes.toLocaleString(), 
      icon: <Clock className="h-5 w-5" />,
      loading: loading.classes
    },
    { 
      title: "Pending Leaves", 
      value: stats.leaves.toLocaleString(), 
      icon: <AlertCircle className="h-5 w-5" />,
      loading: loading.leaves
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button 
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => fetchData()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Refresh Data
        </button>
      </div>

      {/* User Role Filter */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'ADMIN', 'FACULTY', 'STUDENT'] as UserRoleFilter[]).map(role => (
          <button
            key={role}
            onClick={() => setUserRoleFilter(role)}
            className={`px-3 py-1 rounded-md text-sm ${
              userRoleFilter === role
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {role.charAt(0) + role.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
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
                    location={event.location}
                    type={event.type}
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