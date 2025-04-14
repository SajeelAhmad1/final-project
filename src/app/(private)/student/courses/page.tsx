'use client';
import { useState, useEffect } from 'react';
import { Button, Select, message, Card, Table, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { EnrolledCoursesTable } from '@/components/EnrollmentCourseTable';
import { useSession } from 'next-auth/react';

export default function CourseRegistration() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const router = useRouter();
  const {data: session}:any = useSession();
  console.log(session)

  // Fetch available courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.status}`);
        }
        const data = await response.json();
        setAvailableCourses(data);
      } catch (error: any) {
        console.error('Fetch courses error:', error);
        message.error(error.message || 'Failed to load courses');
        setAvailableCourses([]); // Set empty array on error
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const semesters = [
    { value: 'FALL_2023', label: 'Fall 2023' },
    { value: 'SPRING_2024', label: 'Spring 2024' },
    { value: 'SUMMER_2024', label: 'Summer 2024' }
  ];

  const handleRegister = async () => {
    if (!selectedCourse || !selectedSemester) {
      message.error('Please select both course and semester');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          semester: selectedSemester,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      message.success('Successfully registered for course!');
      // Reset selections after successful registration
      setSelectedCourse('');
      setSelectedSemester('');
      router.refresh();
    } catch (error: any) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Course Registration" className="mb-6">
        {coursesLoading ? (
          <div className="flex justify-center">
            <Spin tip="Loading courses..." />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Select Semester</label>
              <Select
                className="w-full"
                options={semesters}
                value={selectedSemester}
                onChange={setSelectedSemester}
                placeholder="Select semester"
              />
            </div>

            <div>
              <label className="block mb-2">Select Course</label>
              <Select
                className="w-full"
                options={availableCourses.map((course: any) => ({
                  value: course.id,
                  label: `${course.code} - ${course.name} (${course.availableSeats} seats available)`,
                  disabled: course.availableSeats <= 0
                }))}
                value={selectedCourse}
                onChange={setSelectedCourse}
                placeholder="Select course"
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            <Button
              type="primary"
              onClick={handleRegister}
              loading={loading}
              disabled={!selectedCourse || !selectedSemester}
            >
              Register
            </Button>
          </div>
        )}
      </Card>

      <Card title="My Courses">
        <EnrolledCoursesTable />
      </Card>
    </div>
  );
}