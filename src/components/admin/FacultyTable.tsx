import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Faculty {
  id: string;
  department: string;
  designation: string;
  user: {
    email: string;
    createdAt: string;
  };
}

interface FacultyTableProps {
  faculties: Faculty[];
}

export default function FacultyTable({ faculties }: FacultyTableProps) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {faculties.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No faculty members found matching your criteria.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faculties.map((faculty) => (
              <tr
              className='cursor-pointer hover:bg-gray-100'
                onClick={() => router.push(`/admin/faculty/${faculty.id}`)}
                key={faculty.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {faculty.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {faculty.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {faculty.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(faculty.user.createdAt).toLocaleDateString()}
                </td>
                <td className="flex px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div
                    onClick={() => router.push(`/admin/faculty/${faculty.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </div>
                  <button className="text-red-600 hover:text-red-900">
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}