'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building,
  Clock,
  Calendar,
  Bell,
  Settings,
  Menu,
  X,
  Home,
  BarChart,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import logo from "@/assets/logo.png"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Students', href: '/admin/students', icon: GraduationCap },
    { name: 'Faculty', href: '/admin/faculty', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Sessions', href: '/admin/sessions', icon: BookOpen },
    { name: 'Classes', href: '/admin/classes', icon: Clock },
    { name: 'Rooms', href: '/admin/rooms', icon: Building },
    { name: 'Time Table', href: '/admin/timetable', icon: Building },
    { name: 'Enrollments', href: '/admin/enrollments', icon: Building },
    { name: 'Exams', href: '/admin/exams', icon: Calendar },
    { name: 'Leaves', href: '/admin/leaves', icon: Calendar },
  ];

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/login'
      });
      
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white z-50 px-4 py-2 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 pt-16 max-w-xs w-full bg-white shadow-lg z-50 flex flex-col">
            <nav className="mt-5 px-2 space-y-1 flex-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${isActive
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 
                        ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {/* Logout button for mobile */}
            <div className="px-2 py-4 border-t">
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Image
              src={logo.src}
              width={70}
              height={70}
              alt='logo'
              className='mx-auto'
            />
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${isActive
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 h-5 w-5 
                        ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            {/* Logout button for desktop */}
            <div className="px-2 py-4 mt-auto border-t">
              <button
                onClick={handleLogout}
                className="group flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pt-16 lg:pt-6 px-8">
          {children}
        </main>
      </div>
    </div>
  );
}