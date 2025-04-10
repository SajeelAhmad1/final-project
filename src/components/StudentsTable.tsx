"use client";

import { 
    ArrowUp, 
    ArrowDown, 
    ChevronLeft, 
    ChevronRight 
  } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
export type StudentWithUser = {
    id: string;
    rollNumber: string;
    batch: string;
    department: string;
    phone: string;
    createdAt: Date;
    user: {
      email: string;
      verified: boolean;
      isProfileComplete: boolean;
    };
  };
  
  export type StudentsSearchParams = {
    page?: string;
    search?: string;
    batch?: string;
    department?: string;
  };
export default function StudentsTable({
  students,
  totalPages,
}: {
  students: StudentWithUser[];
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const sortBy = (field: string) => {
    const params = new URLSearchParams(searchParams);
    const currentSort = params.get("sort");
    const currentOrder = params.get("order");

    if (currentSort === field) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("order", "asc");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const getSortIcon = (field: string) => {
    const currentSort = searchParams.get("sort");
    const currentOrder = searchParams.get("order");

    if (currentSort !== field) return null;
    return currentOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => sortBy("rollNumber")}
                >
                  Roll Number {getSortIcon("rollNumber")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-medium cursor-pointer"
                  onClick={() => sortBy("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-medium cursor-pointer"
                  onClick={() => sortBy("batch")}
                >
                  Batch {getSortIcon("batch")}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 font-medium cursor-pointer"
                  onClick={() => sortBy("department")}
                >
                  Department {getSortIcon("department")}
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Phone
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {students?.map((student) => (
                <tr
                  key={student.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {student.rollNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.batch}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.department}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        student.user.verified
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {student.user.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex w-full justify-center">
        <div className="inline-flex items-center space-x-1">
          <button
            onClick={() => createPageURL(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => createPageURL(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}