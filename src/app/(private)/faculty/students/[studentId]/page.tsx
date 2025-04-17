"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentDetails {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  batch: string;
  department: string;
  phone: string;
  imageUrl?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  user: {
    email: string;
    verified: boolean;
    createdAt: string;
  };
  enrollments: {
    id: string;
    semester: string;
    status: string;
    course: {
      code: string;
      name: string;
      credits: number;
    };
  }[];
  seatings: {
    id: string;
    seatNumber: string;
    exam: {
      id: string;
      date: string;
      course: {
        code: string;
        name: string;
      };
      room: {
        name: string;
      };
    };
  }[];
}

const Page = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${studentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student");
        }
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mt-8"></div>
          <div className="grid grid-cols-1 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-4">
        <p>Student not found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start gap-4 mb-6">
        {student.imageUrl && (
          <img
            src={student.imageUrl}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-gray-600">{student.rollNumber}</p>
          <p className="text-gray-600">
            {student.department} • Batch {student.batch}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {student.user.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {student.phone}
            </p>
            <p>
              <span className="font-medium">Account Status:</span>{" "}
              {student.user.verified ? "Verified" : "Not Verified"}
            </p>
            {student.streetAddress && (
              <p>
                <span className="font-medium">Address:</span> {student.streetAddress}
                {student.city && `, ${student.city}`}
                {student.state && `, ${student.state}`}
                {student.postalCode && `, ${student.postalCode}`}
                {student.country && `, ${student.country}`}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Member Since:</span>{" "}
              {new Date(student.user.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Department:</span> {student.department}
            </p>
            <p>
              <span className="font-medium">Batch:</span> {student.batch}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Enrollments</h2>
        {student.enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No current enrollments</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Exam Seating Arrangements</h2>
        {student.seatings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seat Number
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.seatings.map((seating) => (
                  <tr key={seating.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seating.exam.course.name} ({seating.exam.course.code})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(seating.exam.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seating.exam.room.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seating.seatNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No seating arrangements found</p>
        )}
      </div>
    </div>
  );
};

export default Page;