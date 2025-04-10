import { useState, useEffect } from 'react';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (department: string) => void;
  designationFilter: string;
  setDesignationFilter: (designation: string) => void;
}

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  designationFilter,
  setDesignationFilter
}: SearchFiltersProps) {
  const [departments, setDepartments] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);

  useEffect(() => {
    // Fetch unique departments and designations from API if needed
    // Or you can hardcode them if they're limited
    const fetchFilters = async () => {
      try {
        // Example API call to get unique values
        // const res = await fetch('/api/faculty/filters');
        // const data = await res.json();
        // setDepartments(data.departments);
        // setDesignations(data.designations);
        
        // For now, using mock data
        setDepartments(['Computer Science', 'Mathematics', 'Physics', 'Chemistry']);
        setDesignations(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by email, department, or designation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            id="department"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
            Designation
          </label>
          <select
            id="designation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}