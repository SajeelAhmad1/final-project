"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchStudents({
  placeholder,
  batches,
  departments,
}: {
  placeholder: string;
  batches: string[];
  departments: string[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleBatchChange = (batch: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (batch) {
      params.set("batch", batch);
    } else {
      params.delete("batch");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleDepartmentChange = (department: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (department) {
      params.set("department", department);
    } else {
      params.delete("department");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="relative flex flex-1 flex-shrink-0">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("search")?.toString()}
        />
        <svg
          className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Batch
          </label>
          <select
            id="batch"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2"
            onChange={(e) => handleBatchChange(e.target.value)}
            defaultValue={searchParams.get("batch")?.toString() || ""}
          >
            <option value="">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Department
          </label>
          <select
            id="department"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm outline-2"
            onChange={(e) => handleDepartmentChange(e.target.value)}
            defaultValue={searchParams.get("department")?.toString() || ""}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}