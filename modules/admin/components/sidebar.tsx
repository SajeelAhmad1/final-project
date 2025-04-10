// src/components/admin/Sidebar.tsx
"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, GraduationCap, BookOpen, Building, Clock, Calendar, Bell, Settings, Home, BarChart } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { title: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
    { title: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { title: 'Students', icon: <GraduationCap size={20} />, path: '/admin/students' },
    { title: 'Faculty', icon: <Users size={20} />, path: '/admin/faculty' },
    { title: 'Courses', icon: <BookOpen size={20} />, path: '/admin/courses' },
    { title: 'Classes', icon: <Clock size={20} />, path: '/admin/classes' },
    { title: 'Rooms', icon: <Building size={20} />, path: '/admin/rooms' },
    { title: 'Exams', icon: <Calendar size={20} />, path: '/admin/exams' },
    { title: 'Leaves', icon: <Calendar size={20} />, path: '/admin/leaves' },
    { title: 'Notifications', icon: <Bell size={20} />, path: '/admin/notifications' },
    { title: 'Reports', icon: <BarChart size={20} />, path: '/admin/reports' },
    { title: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin </h1>
      </div>
      <nav className="px-2 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;