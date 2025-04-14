"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FacultyDetails {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  phone?: string;
  imageUrl?: string;
  user: {
    email: string;
    verified: boolean;
    createdAt: string;
  };
  courses: {
    id: string;
    code: string;
    name: string;
    department: string;
    credits: number;
  }[];
  leaves: {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    substitute?: {
      firstName: string;
      lastName: string;
    };
  }[];
  invigilations: {
    id: string;
    date: string;
    course: {
      code: string;
      name: string;
    };
    room: {
      name: string;
    };
  }[];
}

const Page = () => {
  const { facultyId } = useParams();
  const [faculty, setFaculty] = useState<FacultyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`/api/admin/faculty/${facultyId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch faculty");
        }
        const data = await response.json();
        setFaculty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [facultyId]);

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

  if (!faculty) {
    return (
      <div className="p-4">
        <p>Faculty not found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-start gap-4 mb-6">
        {faculty.imageUrl && (
          <img
            src={faculty.imageUrl}
            alt={`${faculty.firstName} ${faculty.lastName}`}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {faculty.firstName} {faculty.lastName}
          </h1>
          <p className="text-gray-600">{faculty.designation}</p>
          <p className="text-gray-600">{faculty.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {faculty.user.email}
            </p>
            {faculty.phone && (
              <p>
                <span className="font-medium">Phone:</span> {faculty.phone}
              </p>
            )}
            <p>
              <span className="font-medium">Account Status:</span>{" "}
              {faculty.user.verified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Department:</span> {faculty.department}
            </p>
            <p>
              <span className="font-medium">Designation:</span> {faculty.designation}
            </p>
            <p>
              <span className="font-medium">Member Since:</span>{" "}
              {new Date(faculty.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Assigned Courses</h2>
        {faculty.courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faculty.courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No assigned courses</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Leaves</h2>
          {faculty.leaves.length > 0 ? (
            <div className="space-y-4">
              {faculty.leaves.slice(0, 3).map((leave) => (
                <div key={leave.id} className="border-b pb-2">
                  <p>
                    <span className="font-medium">Dates:</span>{" "}
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : leave.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </p>
                  {leave.substitute && (
                    <p>
                      <span className="font-medium">Substitute:</span>{" "}
                      {leave.substitute.firstName} {leave.substitute.lastName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent leaves</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Invigilations</h2>
          {faculty.invigilations.length > 0 ? (
            <div className="space-y-4">
              {faculty.invigilations
                .filter((invigilation) => new Date(invigilation.date) > new Date())
                .slice(0, 3)
                .map((invigilation) => (
                  <div key={invigilation.id} className="border-b pb-2">
                    <p>
                      <span className="font-medium">Course:</span>{" "}
                      {invigilation.course.name} ({invigilation.course.code})
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(invigilation.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Room:</span>{" "}
                      {invigilation.room.name}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming invigilations</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;