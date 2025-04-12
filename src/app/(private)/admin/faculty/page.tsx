'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import FacultyTable from '@/components/admin/FacultyTable';
import SearchFilters from '@/components/admin/SearchFilters';

interface Faculty {
  id: string;
  department: string;
  designation: string;
  user: {
    email: string;
    createdAt: string;
  };
}

export default function FacultyPage() {
  const { data: session, status } = useSession();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');

  // Redirect if not admin
  // if (status === 'unauthenticated') {
  //   redirect('/login');
  // }

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('q', searchTerm);
        if (departmentFilter) queryParams.append('department', departmentFilter);
        if (designationFilter) queryParams.append('designation', designationFilter);

        const res = await fetch(`/api/faculty?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setFaculties(data);
        } else {
          console.error('Failed to fetch faculties');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [searchTerm, departmentFilter, designationFilter]);

 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Faculty Management</h1>
      
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        designationFilter={designationFilter}
        setDesignationFilter={setDesignationFilter}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <FacultyTable faculties={faculties} />
      )}
    </div>
  );
}