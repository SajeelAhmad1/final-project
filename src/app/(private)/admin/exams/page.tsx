"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Exam {
  id: string;
  courseName: string;
  date: string;
  duration: number;
  roomName: string;
  invigilatorName: string;
  invigilatorId: string | null;
}

// Skeleton Loading Component
const ExamSkeleton = () => (
  <div className="p-4 border rounded shadow-sm space-y-2 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="h-8 bg-gray-200 rounded w-24 mt-2"></div>
  </div>
);

const Page = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch("/api/exams/schedule");
        const data = await res.json();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Exams Dashboard</h1>
          <p className="text-gray-600">Manage exams, schedules, and seating plans.</p>
        </div>
        <button
          onClick={() => router.push("/admin/exams/schedule")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Schedule New Exam
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Scheduled Exams</h2>
      
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <ExamSkeleton key={i} />
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="p-8 text-center border rounded">
          <p className="text-gray-500">No exams scheduled yet.</p>
          <button
            onClick={() => router.push("/admin/exams/schedule")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Schedule Your First Exam
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <div key={exam.id} className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-lg">{exam.courseName}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p>{new Date(exam.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p>{exam.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Room</p>
                  <p>{exam.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Invigilator</p>
                  <p>{exam.invigilatorName}</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/admin/exams/${exam.id}/seating-plan`)}
                className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                View Seating Plan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;