import { fetchFilteredStudents, fetchStudentsPages, getBatches, getDepartments } from "./actions";
import StudentsTable from "@/components/StudentsTable";
import SearchStudents from "@/components/SearchStudents";

export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      page?: string;
      search?: string;
      batch?: string;
      department?: string;
    };
  }) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.search || "";
    const batch = searchParams?.batch || "";
    const department = searchParams?.department || "";
  
    const [students, totalPages, batches, departments] = await Promise.all([
      fetchFilteredStudents(query, currentPage, batch, department),
      fetchStudentsPages(query, batch, department),
      getBatches(),
      getDepartments(),
    ]);
  
    return (
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Students</h1>
        </div>
        
        {/* Correctly pass props to SearchStudents */}
        <SearchStudents 
          placeholder="Search students..." 
          batches={batches} 
          departments={departments} 
        />
        
        {/* Correctly pass props to StudentsTable */}
        <StudentsTable students={students} totalPages={totalPages} />
      </div>
    );
  }